import { assignDoctor, bookApt, checkSymptoms, getPatientById, writeReport } from '../apis'
import { useState } from 'react'
import './main.css'
import { jwtDecode } from 'jwt-decode'

export function Main() {
  const [prediction, setPrediction] = useState({})
  const [symptoms, setSymptoms] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false) // 🔹 New loading state

  const handleSymptomChange = (e) => {
    setSymptoms(e.target.value)
  }

  const generateResults = async (e) => {
    e.preventDefault()
    setLoading(true) // start spinner
    try {
      let { data: res } = await checkSymptoms({ query: symptoms })
      console.log('API Response:', res)
      if (res.success) {
        // alert('Symptoms analysis completed successfully!')
        setPrediction(res)
        console.log('API is working', res)
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      alert(error.message || 'An error occurred')
    } finally {
      setLoading(false) // stop spinner
    }
  }

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault()
    const { sub: patientId } = jwtDecode(localStorage.getItem('access'))
    console.log('patientId: ', patientId)
    const doc = await assignDoctor()
    console.log('doc: ', doc)

    const patientObject = await getPatientById(patientId)
    const aptData = {
      patientId,
      doctorId: doc.data.doctor.id,
      message: {
        fullName: `${patientObject.data.fname} ${patientObject.data.lname}`,
        recipient: patientObject.data.email,
        date,
        period: time,
        reason: symptoms,
        docFullName: `${doc.data.doctor.fname} ${doc.data.doctor.lname}`
      }
    }
    const reportData = { patientId, doctorId: doc.data.doctor.id, diagnosis: prediction }
    await writeReport(reportData)
    await bookApt(aptData)
    setShowModal(false)
    setSymptoms('')
    setTime('')
    setDate('')
    setPrediction({})
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
          <p>Enter a clinical problem representation below to generate either a clinical reasoning.</p>
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
            <button className='btn btn-primary' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <span className='spinner'></span> Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
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
                      <ul className='point'>
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
                  <ul className='point'>
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
              <button className='btn btn-primary' type='button' onClick={() => setShowModal(true)}>
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className='appointment-modal'>
          <div className='modal-content'>
            <h2>Book Appointment</h2>
            <form onSubmit={handleAppointmentSubmit}>
              <label>
                Select Date:
                <input type='date' value={date} onChange={(e) => setDate(e.target.value)} required />
              </label>
              <label>
                Select Time:
                {/* <input type='time' value={time} onChange={(e) => setTime(e.target.value)} required /> */}
                <select name='period' id='time' onChange={(e) => setTime(e.target.value)} value={time} required>
                  <option value=''>--Select a period--</option>
                  <option value='Morning'>Morning</option>
                  <option value='Afternoon'>Afternoon</option>
                  <option value='Evening'>Evening</option>
                </select>
              </label>

              <div className='modal-buttons'>
                <button type='submit' className='btn btn-primary'>
                  Confirm
                </button>
                <button type='button' className='btn btn-secondary' onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
