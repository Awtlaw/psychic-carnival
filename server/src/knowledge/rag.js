/* eslint-disable no-unused-vars */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { vectorStore } from './embed.js';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY missing from .env');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

class MedicalRAGSystem {
  constructor(vectorStore, model) {
    this.vectorStore = vectorStore;
    this.model = model;
    this.similarityThreshold = 1.2;
  }

  async retrieveRelevantCases(query, topK = 5) {
    const results = await this.vectorStore.similaritySearchWithScore(
      query,
      topK,
    );

    return results
      .filter(([_, score]) => score <= this.similarityThreshold)
      .map(([doc, score]) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
        score: score,
      }));
  }

  createStructuredMedicalPrompt(userQuery, retrievedCases) {
    const casesText = retrievedCases
      .map((case_, index) => `${index + 1}. ${case_.content}`)
      .join('\n');

    return `You are a medical AI assistant helping with diagnostic suggestions. You must respond with ONLY valid JSON in the exact format specified below.

**IMPORTANT DISCLAIMERS:**
- You are NOT a replacement for professional medical diagnosis
- These are suggestions only - patients should consult healthcare providers
- In emergencies, patients should seek immediate medical attention

**USER QUERY:** ${userQuery}

**RELEVANT MEDICAL CASES FROM DATABASE:**
${casesText}

**INSTRUCTIONS:**
Based on the similar cases above, provide a JSON response in EXACTLY this format:

{
  "possible_conditions": [
    {
      "name": "Condition Name",
      "reason": "Brief explanation why this condition matches the symptoms"
    }
  ],
  "reasoning": "Detailed explanation of the connection between symptoms and conditions based on the retrieved cases",
  "recommendations": {
    "immediate_actions": "What the patient should do right now (rest, hydration, etc.)",
    "when_to_seek_care": "Specific criteria for when to see a healthcare provider",
    "tests": ["List", "of", "recommended", "tests"]
  },
  "red_flags": ["List", "of", "symptoms", "requiring", "immediate", "care"]
}

**REQUIREMENTS:**
1. Include 2-3 most likely conditions in possible_conditions array
2. Keep reasoning concise but informative (2-3 sentences)
3. Provide actionable immediate_actions
4. Include 3-5 relevant tests in the tests array
5. List 3-5 red flag symptoms
6. Respond with ONLY the JSON object, no additional text

Generate the JSON response now:`;
  }

  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;

        if (error.status === 503 || error.status === 429) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  createFallbackResponse(userQuery, retrievedCases) {
    const conditions = this.extractConditionsFromCases(retrievedCases);

    return {
      possible_conditions: conditions.slice(0, 3),
      reasoning: `Based on ${retrievedCases.length} similar medical cases in our database, these conditions commonly present with similar symptoms. However, AI analysis is currently unavailable.`,
      recommendations: {
        immediate_actions: 'Monitor symptoms, rest, stay hydrated',
        when_to_seek_care: 'If symptoms worsen or persist beyond 2-3 days',
        tests: ['Complete blood count', 'Basic metabolic panel', 'Urinalysis'],
      },
      red_flags: [
        'Severe or worsening symptoms',
        'High fever (>101.3°F/38.5°C)',
        'Difficulty breathing',
        'Severe pain',
        'Signs of dehydration',
      ],
    };
  }

  extractConditionsFromCases(cases) {
    const commonConditions = [
      {
        keywords: ['fever', 'headache', 'throat'],
        name: 'Viral Upper Respiratory Infection',
        reason: 'Common viral symptoms',
      },
      {
        keywords: ['stomach', 'pain', 'nausea', 'vomit'],
        name: 'Gastroenteritis',
        reason: 'Digestive symptoms',
      },
      {
        keywords: ['burning', 'urine', 'urination'],
        name: 'Urinary Tract Infection',
        reason: 'Urinary symptoms',
      },
      {
        keywords: ['joint', 'pain', 'stiffness', 'muscle'],
        name: 'Musculoskeletal Condition',
        reason: 'Joint and muscle symptoms',
      },
      {
        keywords: ['fatigue', 'tired', 'weakness'],
        name: 'Viral Syndrome',
        reason: 'General viral symptoms',
      },
    ];

    const casesText = cases.map((c) => c.content.toLowerCase()).join(' ');

    return commonConditions
      .filter((condition) =>
        condition.keywords.some((keyword) => casesText.includes(keyword)),
      )
      .map((condition) => ({
        name: condition.name,
        reason: condition.reason,
      }));
  }

  async generateStructuredResponse(userQuery) {
    try {
      const retrievedCases = await this.retrieveRelevantCases(userQuery);

      if (retrievedCases.length === 0) {
        return {
          success: false,
          message: 'No relevant medical cases found in database.',
          cases: [],
        };
      }

      const prompt = this.createStructuredMedicalPrompt(
        userQuery,
        retrievedCases,
      );

      try {
        const result = await this.retryWithBackoff(async () => {
          return await this.model.generateContent(prompt);
        });

        const responseText = result.response.text();
        let parsedResponse;

        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : responseText;
          parsedResponse = JSON.parse(jsonString);
        } catch {
          parsedResponse = this.createFallbackResponse(
            userQuery,
            retrievedCases,
          );
        }

        return {
          success: true,
          query: userQuery,
          isEmergency: false,
          confidence: this.calculateConfidence(retrievedCases),
          response: parsedResponse,
          cases: retrievedCases.slice(0, 5),
        };
      } catch {
        const fallbackResponse = this.createFallbackResponse(
          userQuery,
          retrievedCases,
        );

        return {
          success: true,
          query: userQuery,
          isEmergency: false,
          confidence: this.calculateConfidence(retrievedCases),
          response: {
            ...fallbackResponse,
            reasoning:
              fallbackResponse.reasoning +
              ' (Note: AI analysis temporarily unavailable)',
          },
          cases: retrievedCases.slice(0, 5),
          fallback: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        cases: [],
      };
    }
  }

  calculateConfidence(cases) {
    if (cases.length === 0) return 'Low';

    const avgScore =
      cases.reduce((sum, case_) => sum + case_.score, 0) / cases.length;

    if (avgScore < 0.6) return 'Very High';
    if (avgScore < 0.8) return 'High';
    if (avgScore < 1.0) return 'Medium';
    return 'Low';
  }

  checkForEmergencySymptoms(query) {
    const emergencyKeywords = [
      'chest pain',
      'difficulty breathing',
      'severe headache',
      'unconscious',
      'bleeding',
      'severe pain',
      'heart attack',
      'stroke',
      'allergic reaction',
      'severe burns',
      'choking',
      'seizure',
      'loss of consciousness',
      'severe allergic reaction',
      'anaphylaxis',
    ];

    return emergencyKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword),
    );
  }

  createEmergencyResponse(userInput) {
    return {
      success: true,
      query: userInput,
      isEmergency: true,
      confidence: 'Emergency',
      response: {
        possible_conditions: [
          {
            name: 'Medical Emergency',
            reason:
              'Symptoms indicate potential life-threatening condition requiring immediate medical attention',
          },
        ],
        reasoning:
          'The symptoms you described may indicate a medical emergency that requires immediate professional medical evaluation and treatment.',
        recommendations: {
          immediate_actions:
            'Call emergency services (911) immediately - do not wait or delay',
          when_to_seek_care: 'NOW - Seek immediate emergency medical attention',
          tests: ['Emergency medical evaluation required'],
        },
        red_flags: [
          'Any emergency symptoms require immediate medical attention',
          'Do not attempt self-treatment',
          'Time is critical in emergency situations',
        ],
      },
      cases: [],
    };
  }

  async query(userInput) {
    if (this.checkForEmergencySymptoms(userInput)) {
      return this.createEmergencyResponse(userInput);
    }
    return await this.generateStructuredResponse(userInput);
  }
}

const SymptomChecker = new MedicalRAGSystem(vectorStore, model);

export { MedicalRAGSystem, SymptomChecker as default };
