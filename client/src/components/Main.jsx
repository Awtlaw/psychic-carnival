import './main.css'
export function Main() {
  const generateResults = () => {
    // Placeholder for the function that generates results
    console.log('Generating results...')
  }
  return (
    <div className='main-body'>
      <div className='text-area'>
        <div className='note'>
          <p>
            Welcome to HealthConnect AI! Our platform utilizes diagnostic one-liners to provide accurate healthcare solutions. We analyze
            relevant demographics, history, symptoms, and test results to generate precise recommendations. Please avoid abbreviations.
            Clinical AI, our experimental feature, uses advanced AI to draft differential diagnoses or clinical plans. Remember, AI output
            should be interpreted carefully and never replace professional judgment.
          </p>
        </div>

        <div className='input-instruction'>
          <p>Enter a clinical problem representation below to generate either a DDx or clinical plan.</p>
        </div>

        <div className='examples'>
          <p className='example-title'>Try an example:</p>
          <div className='example-list'>
            <div className='example-item'>Chest Pain DDx</div>
            <div className='example-item'>ADHF Clinical plan</div>
            <div className='example-item'>AMS DDx</div>
            <div className='example-item'>ACS Clinical plan</div>
          </div>
        </div>

        <div className='input-header'>
          <p>Main complaint</p>
        </div>
        <textarea className='input-box' id='myInput' placeholder='Type here'></textarea>

        <div className='buttons'>
          <button className='btn btn-primary'>Differential diagnosis</button>
          <button className='btn btn-outline'>Clinical plan</button>
          <button className='btn btn-accent' onClick={generateResults()}>
            Generate 🤖
          </button>
        </div>

        <div className='output-container'>
          <p id='myOutput'></p>
          <div className='buttons-sec'>
            <button className='btn btn-primary' id='downloadPdf' style={{ display: 'none' }}>
              Download PDF
            </button>
            <button className='btn btn-accent' id='copy' style={{ display: 'none' }}>
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className='note small'>
        <p>
          Note: HealthConnect AI is an advanced tool under development for healthcare professionals and medical researchers. It is not
          intended for general use or to provide medical advice. Its purpose is to assist trained professionals in generating accurate
          diagnoses, treatment plans, and conducting medical research.
        </p>
      </div>
    </div>
  )
}
