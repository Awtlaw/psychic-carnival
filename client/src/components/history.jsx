import { faClock, faFile, faCalendarCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'
import { useEffect, useState } from 'react'
import { listReports, getPatientById, listPendingApts } from '../apis'
import { parseISO, format, isValid } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { Logout } from '../pages/login/login'
import { Link } from 'react-router-dom'

export function History() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({})
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loadingApts, setLoadingApts] = useState(false)

  // Decode doctor ID
  let loggedInDoc = null
  try {
    const token = localStorage.getItem('access')
    loggedInDoc = token ? jwtDecode(token).sub : null
  } catch (err) {
    console.error('Invalid token:', err)
  }

  // Fetch reports
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

  // Filter reports for logged-in doctor
  const doctorReports = reportsList.filter((r) => r.doctorId === loggedInDoc)

  // Metrics
  const totalReports = doctorReports.length
  const recentReports = doctorReports.slice(-5).reverse()
  // const today = new Date()
  const todayAppointments = 0 // placeholder for future API

  return (
    <div className='layout2'>
      {/* Sidebar */}
      <aside className='sidebar1'>
        <h2>HealthConnect</h2>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            🏠 Dashboard
          </li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
            📝 Reports
          </li>
          <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            📅 Appointments
          </li>
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            ⚙ Settings
          </li>
        </ul>
        <Logout />
      </aside>

      {/* Main Content */}
      <div className='history-container'>
        {activeTab === 'dashboard' && (
          <>
            <h2 className='history-title'>📊 Dashboard</h2>
            <hr />

            {/* Metrics Cards */}
            <div className='dashboard-metrics'>
              <div className='metric-card'>
                <FontAwesomeIcon icon={faFile} className='metric-icon' />
                <div>Total Reports</div>
                <div className='metric-value'>{totalReports}</div>
              </div>
              <div className='metric-card'>
                <FontAwesomeIcon icon={faCalendarCheck} className='metric-icon' />
                <div>Today's Appointments</div>
                <div className='metric-value'>{todayAppointments}</div>
              </div>
              <div className='metric-card'>
                <FontAwesomeIcon icon={faHourglassHalf} className='metric-icon' />
                <div>Pending Reports</div>
                <div className='metric-value'>{0}</div> {/* Placeholder */}
              </div>
            </div>

            {/* Recent Reports */}
            <h3>Recent Reports</h3>
            {recentReports.length > 0 ? (
              <div className='reports-list'>
                {recentReports.map((r) => {
                  const patient = patients[r.patientId]
                  const patientName = patient ? `${patient.fname} ${patient.lname}` : 'Loading patient...'
                  let formattedDate = 'Unknown date'
                  try {
                    formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
                  } catch (err) {
                    console.log('feild to load recent report', err)
                  }
                  return (
                    <div className='report-card' key={r.id}>
                      <div className='report-info'>
                        <FontAwesomeIcon icon={faFile} className='report-icon' />
                        <div className='report-text'>{patientName}</div>
                      </div>
                      <div className='report-time'>
                        <FontAwesomeIcon icon={faClock} className='time-icon' />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className='no-records'>
                <h3>No Recent Reports</h3>
              </div>
            )}
          </>
        )}
        {activeTab === 'reports' && (
          <div className='reports-list'>
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
          <div className='tab-content'>
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

        {activeTab === 'settings' && <h2>⚙ Settings (Coming Soon)</h2>}
      </div>
    </div>
  )
}
