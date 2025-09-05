import { assignDoctor, bookApt, checkSymptoms, getPatientById, listPendingApts, listReports, writeReport } from '../apis'
import { useEffect, useState } from 'react'
import './main.css'
import { jwtDecode } from 'jwt-decode'
import { faClock, faFile } from '@fortawesome/free-solid-svg-icons'
import { format, isValid, parseISO } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { Logout } from '../pages/login/login'

export function Main() {
  const [prediction, setPrediction] = useState({})
  const [symptoms, setSymptoms] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('symptom-checker')
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({})
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loadingApts, setLoadingApts] = useState(false)

  const handleSymptomChange = (e) => setSymptoms(e.target.value)

  const generateResults = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let { data: res } = await checkSymptoms({ query: symptoms })
      console.log('API Response:', res)
      if (res.success) {
        setPrediction(res)
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      alert(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault()
    const { sub: patientId } = jwtDecode(localStorage.getItem('access'))
    const doc = await assignDoctor()
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await listReports()
        setReportsList(res.data || [])
      } catch (err) {
        console.error('Failed to load reports:', err)
      }
    }
    fetchReports()
  }, [])

  // Fetch patients
  useEffect(() => {
    if (reportsList.length === 0) return
    const fetchPatients = async () => {
      try {
        const uniqueIds = [...new Set(reportsList.map((r) => r.patientId))]
        const entries = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const patient = await getPatientById(id)
              return [id, patient?.data || null]
            } catch {
              return [id, null]
            }
          })
        )
        setPatients(Object.fromEntries(entries))
      } catch (err) {
        console.error('Failed to load patients:', err)
      }
    }
    fetchPatients()
  }, [reportsList])

  useEffect(() => {
    const fetchApts = async () => {
      setLoadingApts(true)
      try {
        const pendingRes = await listPendingApts()

        setPendingAppointments(pendingRes.data)
      } catch (err) {
        console.error('Failed to load appointments:', err)
      } finally {
        setLoadingApts(false)
      }
    }
    fetchApts()
  }, [])

  return (
    <div className='layout1'>
      {/* Sidebar */}
      <aside className='sidebar'>
        <ul>
          <li className={activeTab === 'symptom-checker' ? 'active' : ''} onClick={() => setActiveTab('symptom-checker')}>
            <a href='#'>🏠 Symptom checker</a>
          </li>

          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <a href='#'>🏠 Profile</a>
          </li>
          <li className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
            <a href='#'>📝 History</a>
          </li>
          <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            <a href='#'>📅 Appointments</a>
          </li>
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <a href='#'>⚙ Settings</a>
          </li>
        </ul>
        <Logout />
      </aside>

      {/* Main Content */}
      {activeTab === 'symptom-checker' && (
        <div className='main-body'>
          <div className='text-area'>
            <div className='note'>
              <p>Welcome to HealthConnect AI! Our platform utilizes diagnostic one-liners to provide accurate healthcare solutions...</p>
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
                  <button className='btn btn-primary' style={{ display: 'none' }}>
                    Download PDF
                  </button>
                  <button className='btn btn-accent' style={{ display: 'none' }}>
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
                    <select name='period' onChange={(e) => setTime(e.target.value)} value={time} required>
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
            <p>Note: HealthConnect AI is an advanced tool under development for healthcare professionals...</p>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className='main-body'>
          {reportsList.length > 0 ? (
            reportsList.map((r) => {
              const patient = patients[r.patientId]
              const patientName = patient ? `Report for ${patient.fname ?? ''} ${patient.lname ?? ''}`.trim() : 'Loading patient...'

              let formattedDate = 'Unknown date'
              try {
                formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
              } catch {
                console.warn('Invalid date for report:', r.createdAt)
              }

              return (
                <div className='report-card' key={r.id ?? Math.random()}>
                  <div className='report-info'>
                    <FontAwesomeIcon icon={faFile} className='report-icon' />
                    <div className='report-text'>
                      <Link to={`/reports/${r.id}`} className='report-link'>
                        {patientName}
                      </Link>
                    </div>
                  </div>
                  <div className='report-time'>
                    <FontAwesomeIcon icon={faClock} className='time-icon' />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='no-records'>
              <h3>No Reports Found</h3>
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className='main-body'>
          <h1>Pending Appointments</h1>
          {loadingApts ? (
            <Spinner />
          ) : pendingAppointments?.length === 0 ? (
            <p>No pending appointments</p>
          ) : (
            <div className='reports-list'>
              {pendingAppointments.map((apt) => {
                const fullName = apt.message?.fullName || 'Unknown patient'

                // Validate date before formatting
                let formattedDate = 'Unknown date'
                try {
                  const d = parseISO(apt.message?.date)
                  if (isValid(d)) {
                    formattedDate = format(d, 'MMM dd, yyyy HH:mm')
                  }
                } catch (err) {
                  console.log(err)
                  console.warn('Invalid date:', apt.message?.date)
                }

                return (
                  <div className='report-card' key={apt.id}>
                    <div className='report-info'>
                      <FontAwesomeIcon icon={faClock} className='report-icon' />
                      <div className='report-text'>
                        <span className='report-link'>{fullName}</span>
                      </div>
                    </div>
                    <div className='report-time'>
                      <FontAwesomeIcon icon={faClock} className='time-icon' />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
