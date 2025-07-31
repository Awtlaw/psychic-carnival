/* eslint-disable no-unused-vars */
// test-retrieval.js - Phase 2 Step 3: Test your retrieval system
import { vectorStore } from './embed.js';

async function testRetrieval() {
  console.log('🧪 TESTING VECTOR DATABASE RETRIEVAL');
  console.log('='.repeat(60));

  // Test queries based on your medical data
  const testQueries = [
    'fever and headache in young female',
    '25 year old woman symptoms',
    'chest pain shortness of breath',
    'abdominal pain vomiting',
    'urinary frequency burning',
    'severe headache blurred vision',
  ];

  for (const query of testQueries) {
    console.log(`\n🔍 Query: "${query}"`);
    console.log('-'.repeat(50));

    try {
      // Get top 3 results with similarity scores
      const results = await vectorStore.similaritySearchWithScore(query, 3);

      if (results.length === 0) {
        console.log('❌ No results found');
        continue;
      }

      results.forEach(([doc, score], index) => {
        console.log(
          `\n${index + 1}. Score: ${score.toFixed(3)} ${getScoreEmoji(score)}`,
        );
        console.log(`   ${doc.pageContent}`);
      });

      // Quality assessment
      const avgScore =
        results.reduce((sum, [_, score]) => sum + score, 0) / results.length;
      console.log(
        `\n📊 Average score: ${avgScore.toFixed(3)} ${getQualityAssessment(avgScore)}`,
      );
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message);
    }

    console.log('\n' + '─'.repeat(60));
  }
}

function getScoreEmoji(score) {
  if (score < 0.5) return '🎯 (Excellent match)';
  if (score < 0.8) return '✅ (Good match)';
  if (score < 1.2) return '⚠️ (Fair match)';
  return '❌ (Poor match)';
}

function getQualityAssessment(avgScore) {
  if (avgScore < 0.6) return '🏆 Excellent relevance';
  if (avgScore < 1.0) return '👍 Good relevance';
  if (avgScore < 1.5) return '⚠️ Fair relevance';
  return '❌ Poor relevance - needs adjustment';
}

// Advanced testing function
async function testSpecificScenarios() {
  console.log('\n🏥 TESTING SPECIFIC MEDICAL SCENARIOS');
  console.log('='.repeat(60));

  const medicalScenarios = [
    { query: 'young adult fever', expectedTerms: ['fever', 'young', 'adult'] },
    {
      query: 'chest pain heart',
      expectedTerms: ['chest', 'pain', 'heart', 'myocardial'],
    },
    {
      query: 'urinary infection female',
      expectedTerms: ['urinary', 'UTI', 'female'],
    },
    {
      query: 'severe headache emergency',
      expectedTerms: ['headache', 'severe', 'crisis'],
    },
  ];

  for (const scenario of medicalScenarios) {
    console.log(`\n🔍 Scenario: "${scenario.query}"`);

    const results = await vectorStore.similaritySearch(scenario.query, 2);

    if (results.length > 0) {
      const bestMatch = results[0];
      console.log(`✅ Best match: ${bestMatch.pageContent}`);

      // Check if expected terms appear in results
      const matchesExpected = scenario.expectedTerms.some((term) =>
        bestMatch.pageContent.toLowerCase().includes(term.toLowerCase()),
      );

      if (matchesExpected) {
        console.log('🎯 Contains expected medical terms');
      } else {
        console.log('⚠️ May not contain expected terms - check relevance');
      }
    } else {
      console.log('❌ No matches found');
    }
  }
}

// Interactive testing function
async function interactiveTest() {
  console.log('\n🎯 INTERACTIVE TESTING EXAMPLES');
  console.log('='.repeat(60));

  // Simulate what a user might search for
  const userQueries = [
    'I have a fever and my head hurts',
    'chest pain and trouble breathing',
    'stomach pain and throwing up',
    'burning when I pee',
  ];

  for (const query of userQueries) {
    console.log(`\n👤 User query: "${query}"`);

    const results = await vectorStore.similaritySearchWithScore(query, 2);

    if (results.length > 0) {
      const [bestDoc, score] = results[0];
      console.log(`🏥 System response (score: ${score.toFixed(3)}):`);
      console.log(`   ${bestDoc.pageContent}`);

      if (score < 1.0) {
        console.log(
          '✅ Good match - system would provide relevant information',
        );
      } else {
        console.log('⚠️ Weak match - might need better training data');
      }
    }
  }
}

// Main test runner
async function runAllTests() {
  try {
    await testRetrieval();
    await testSpecificScenarios();
    await interactiveTest();

    console.log('\n🎉 All tests completed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('- If scores look good (< 1.0), proceed to Phase 3');
    console.log(
      '- If scores are high (> 1.2), consider improving your data format',
    );
    console.log(
      '- If no results found, check your medical-documents.json file',
    );
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests
runAllTests();
