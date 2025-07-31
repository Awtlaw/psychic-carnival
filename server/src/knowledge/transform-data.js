import fs from 'fs';

// Read the original medical dataset
const rawData = fs.readFileSync('./medical-data.json', 'utf8');
const originalData = JSON.parse(rawData);

// Transform data into LangChain document format
function transformToDocuments(data) {
  const documents = [];
  const totalRecords = Object.keys(data.AGE).length;

  for (let i = 0; i < totalRecords; i++) {
    // Extract patient data
    const age = data.AGE[i];
    const gender = data.GENDER[i];
    const symptoms = data.SYMPTOMS[i];
    const diagnosis = data.DIAGNOSIS[i];
    const rdt = data.RDT[i];
    const widal = data.WIDAL[i];
    const hpylori = data['H.PHYLORI'][i];
    const urine = data.URINE[i];

    // Skip if essential data is missing
    if (!age || !gender || !symptoms || !diagnosis) {
      continue;
    }

    // Clean and format age
    let cleanAge = age;
    if (typeof age === 'string') {
      // Handle cases like "1yr,3wks" or "11months"
      if (age.includes('yr') || age.includes('month')) {
        cleanAge = age.includes('yr') ? parseInt(age) : 1;
      } else {
        cleanAge = parseInt(age) || age;
      }
    }

    // Clean gender
    const cleanGender = gender.toLowerCase().trim();

    // Clean symptoms
    const cleanSymptoms = symptoms.trim();

    // Clean diagnosis
    const cleanDiagnosis = diagnosis.trim();

    // Build test results section
    let testResults = [];
    if (rdt) testResults.push(`RDT: ${rdt}`);
    if (widal) testResults.push(`WIDAL: ${widal}`);
    if (hpylori) testResults.push(`H.pylori: ${hpylori}`);
    if (urine) testResults.push(`Urine: ${urine}`);

    const testSection =
      testResults.length > 0
        ? ` Laboratory results: ${testResults.join(', ')}.`
        : '';

    // Create document content
    const content = `Patient: ${cleanAge}-year-old ${cleanGender} presenting with ${cleanSymptoms}.${testSection} Diagnosis: ${cleanDiagnosis}.`;

    // Create metadata for filtering and retrieval
    const metadata = {
      patientId: i,
      age: cleanAge,
      gender: cleanGender,
      diagnosis: cleanDiagnosis,
      hasRDT: !!rdt,
      hasWIDAL: !!widal,
      hasHPylori: !!hpylori,
      hasUrine: !!urine,
      // Add symptom keywords for better matching
      symptomKeywords: cleanSymptoms
        .toLowerCase()
        .split(',')
        .map((s) => s.trim()),
    };

    documents.push({
      pageContent: content,
      metadata: metadata,
    });
  }

  return documents;
}

// Transform the data
console.log('Transforming medical data...');
const documents = transformToDocuments(originalData);

// Save transformed data
const outputData = {
  documents: documents,
  totalDocuments: documents.length,
  createdAt: new Date().toISOString(),
};

fs.writeFileSync('medical-documents.json', JSON.stringify(outputData, null, 2));

// Print summary
console.log(`✅ Transformation complete!`);
console.log(`📊 Total documents created: ${documents.length}`);
console.log(`📁 Output saved to: medical-documents.json`);

// Show sample documents
console.log('\n📋 Sample documents:');
documents.slice(0, 3).forEach((doc, index) => {
  console.log(`\n${index + 1}. ${doc.pageContent}`);
  console.log(
    `   Metadata: Age ${doc.metadata.age}, ${doc.metadata.gender}, ${doc.metadata.diagnosis}`,
  );
});

// Show statistics
const ageGroups = documents.reduce((acc, doc) => {
  const age = doc.metadata.age;
  let group;
  if (age < 18) group = 'Child';
  else if (age < 35) group = 'Young Adult';
  else if (age < 50) group = 'Adult';
  else group = 'Senior';

  acc[group] = (acc[group] || 0) + 1;
  return acc;
}, {});

const genderDist = documents.reduce((acc, doc) => {
  acc[doc.metadata.gender] = (acc[doc.metadata.gender] || 0) + 1;
  return acc;
}, {});

console.log('\n📈 Dataset Statistics:');
console.log('Age Groups:', ageGroups);
console.log('Gender Distribution:', genderDist);
console.log('\n🎯 Ready for LangChain RAG system!');
