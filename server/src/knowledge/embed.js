import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { Document } from 'langchain/document';

// Initialize environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Get HF API key (free from huggingface.co/settings/tokens)
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
if (!HF_API_KEY) {
  throw new Error(
    'HUGGING_FACE_API_KEY missing from .env - Get free token from https://huggingface.co/settings/tokens',
  );
}

// Configure embeddings model - using a reliable free model
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: HF_API_KEY,
  model: 'sentence-transformers/all-MiniLM-L6-v2', // Fast, good quality, free
});

const CACHE_FILE = path.resolve(__dirname, './embeddings-cache-hf.json');

// Load documents
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

// Check if embeddings cache exists and is valid
function isCacheValid() {
  if (!fs.existsSync(CACHE_FILE)) {
    console.log('❌ No HuggingFace cache file found');
    return false;
  }

  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    const documents = loadDocuments();

    if (cache.documents && cache.documents.length === documents.length) {
      console.log(
        `✅ Valid HuggingFace cache found with ${cache.documents.length} documents`,
      );
      return true;
    } else {
      console.log(
        `❌ HF Cache invalid: expected ${documents.length} docs, found ${cache.documents?.length || 0}`,
      );
      return false;
    }
  } catch (error) {
    console.log('❌ HF Cache file corrupted:', error.message);
    return false;
  }
}

// Save embeddings to cache
function saveToCache(vectorStore, documents) {
  try {
    const cacheData = {
      timestamp: Date.now(),
      version: '1.0',
      provider: 'huggingface',
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      documents: documents.map((doc, index) => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        embedding: vectorStore.memoryVectors[index]?.embedding,
      })),
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log(
      `✅ HuggingFace embeddings cached successfully (${documents.length} documents)`,
    );
  } catch (error) {
    console.warn('⚠ Failed to cache HF embeddings:', error.message);
  }
}

// Load embeddings from cache
async function loadFromCache() {
  try {
    console.log('🔄 Loading HuggingFace embeddings from cache...');
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    const documents = cache.documents.map(
      (item) =>
        new Document({
          pageContent: item.pageContent,
          metadata: item.metadata,
        }),
    );
    console.log(documents);

    // Create vector store without calling the embedding API
    const vectorStore = new MemoryVectorStore(embeddings);

    // Manually populate the vectors
    vectorStore.memoryVectors = cache.documents.map((item, index) => ({
      content: item.pageContent,
      embedding: item.embedding,
      metadata: item.metadata,
      id: index, // Ensure each vector has a unique ID
    }));

    console.log(`✅ Loaded ${cache.documents.length} HF embeddings from cache`);
    return vectorStore;
  } catch (error) {
    console.warn('⚠ Failed to load from HF cache:', error.message);
    return null;
  }
}

// Initialize vector store with HuggingFace embeddings
async function initializeVectorStore() {
  const documents = loadDocuments();
  console.log(
    `📄 Found ${documents.length} documents to process with HuggingFace`,
  );

  // Try to load from cache first
  if (isCacheValid()) {
    const cachedStore = await loadFromCache();
    if (cachedStore) {
      return cachedStore;
    }
  }

  console.log('🔄 No valid HF cache found, creating embeddings...');
  console.log('🤗 Using HuggingFace free API - much more generous limits!');

  try {
    const vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      embeddings,
    );
    saveToCache(vectorStore, documents);
    console.log('🎉 HuggingFace embeddings created successfully!');
    return vectorStore;
  } catch (error) {
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.error(`
❌ HuggingFace API rate limit exceeded.

Options:
1. Wait a few minutes and try again (HF limits are much more generous than Google)
2. Get a free HF Pro account for higher limits
3. Use local embeddings (see alternative implementation)

Current error: ${error.message}
      `);
    } else if (
      error.message.includes('token') ||
      error.message.includes('unauthorized')
    ) {
      console.error(`
❌ HuggingFace API token issue.

To fix:
1. Go to https://huggingface.co/settings/tokens
2. Create a free account if needed
3. Generate a new token (read permissions are enough)
4. Add HUGGING_FACE_API_KEY=your_token_here to your .env file

Current error: ${error.message}
      `);
    }
    throw error;
  }
}

// Create and export vector store instance
let vectorStore;
try {
  vectorStore = await initializeVectorStore();
  console.log('🚀 HuggingFace Vector store ready!');
} catch (error) {
  console.error('💥 Failed to initialize HF vector store:', error.message);
  vectorStore = null;
}

export { vectorStore, embeddings };
