import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from 'langchain/document';

// Initialize environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY missing from .env');
}

// Configure embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: API_KEY,
  modelName: 'embedding-001',
});

// Load and process documents
function loadDocuments() {
  const rawData = fs.readFileSync(
    path.resolve(__dirname, './medical-documents.json'),
    'utf-8',
  );
  const data = JSON.parse(rawData).documents;

  return data.map(
    (doc, index) =>
      new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          id: index,
          source: 'medical-documents',
        },
      }),
  );
}

// Initialize vector store
async function initializeVectorStore() {
  const documents = loadDocuments();
  return await MemoryVectorStore.fromDocuments(documents, embeddings);
}

// Create and export vector store instance
const vectorStore = await initializeVectorStore();

export { vectorStore, embeddings };
