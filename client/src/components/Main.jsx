import { checkSymptoms } from '../apis'
import { useEffect, useState } from 'react'
import './main.css'

export function Main() {
  const [prediction, setPrediction] = useState({})
  const [symptoms, setSymptoms] = useState('')

  const handleSymptomChange = (e) => {
    setSymptoms(e.target.value)
  }

  const generateResults = async (e) => {
    e.preventDefault()
    try {
      let { data: res } = await checkSymptoms({ query: symptoms })
      if (res.success) {
        alert('Symptoms analysis completed successfully!')
        setPrediction(res) // res is already the data you need
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      alert(error.message || 'An error occurred')
    }
  }

  useEffect(() => {
    console.log(symptoms)
  }, [symptoms])

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
        <form onSubmit={generateResults}>
          <textarea
            className='input-box'
            id='myInput'
            placeholder='Type here'
            name='symptoms'
            value={symptoms}
            onChange={handleSymptomChange}
          ></textarea>
          <div className='buttons'>
            <button className='btn btn-primary' type='submit'>
              Differential diagnosis
            </button>
            <button className='btn btn-outline'>Clinical plan</button>
            <button className='btn btn-accent'>Generate 🤖</button>
          </div>
        </form>

        {/* Fixed: Actually display the prediction data */}
        {prediction?.response?.possible_conditions && (
          <div className='output-container'>
            <div id='myOutput'>
              <h3>Possible Conditions:</h3>
              {prediction.response.possible_conditions.map((condition, index) => (
                <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
                  <h4>{condition.name}</h4>
                  <p>
                    <strong>Reason:</strong> {condition.reason}
                  </p>
                </div>
              ))}

              {prediction.response.reasoning && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Clinical Reasoning:</h4>
                  <p>{prediction.response.reasoning}</p>
                </div>
              )}

              {prediction.response.recommendations && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Recommendations:</h4>
                  <p>
                    <strong>Immediate Actions:</strong> {prediction.response.recommendations.immediate_actions}
                  </p>
                  <p>
                    <strong>When to Seek Care:</strong> {prediction.response.recommendations.when_to_seek_care}
                  </p>

                  {prediction.response.recommendations.tests && (
                    <div>
                      <strong>Suggested Tests:</strong>
                      <ul>
                        {prediction.response.recommendations.tests.map((test, index) => (
                          <li key={index}>{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {prediction.response.red_flags && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                  <h4>Red Flags - Seek Immediate Care:</h4>
                  <ul>
                    {prediction.response.red_flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className='buttons-sec'>
              <button className='btn btn-primary' id='downloadPdf' style={{ display: 'none' }}>
                Download PDF
              </button>
              <button className='btn btn-accent' id='copy' style={{ display: 'none' }}>
                Copy
              </button>
            </div>
          </div>
        )}
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
