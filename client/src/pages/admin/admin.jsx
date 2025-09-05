import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './admin.css'
import { getAllDoctors, getAllPatients, getPatientById, listFulfilledApts, listPendingApts, listReports } from '../../apis'
import { DocSignUp } from '../signup/docSignUp'
import { format, parseISO } from 'date-fns'
import { isValid } from 'date-fns'
import { faClock, faFile, faUserMd, faUser, faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Logout } from '../login/login'

// Spinner component
function Spinner() {
  return (
    <div className='tab-spinner-overlay'>
      <div className='tab-spinner'></div>
      <p>Loading...</p>
    </div>
  )
}

// Reusable component for appointments
function AppointmentList({ appointments, title, loading }) {
  if (loading) return <Spinner />
  if (!appointments.length) return <p>No {title.toLowerCase()}</p>
  return (
    <ul>
      {appointments.map((apt) => (
        <li key={apt.id}>{`Appointment for ${apt.message.fullName}`}</li>
      ))}
    </ul>
  )
}

// Reusable component for reports
function ReportList({ reports, patients, loading }) {
  if (loading) return <Spinner />
  if (!reports.length) return <p>No reports available</p>

  return (
    <div className='reports-list'>
      {reports.map((r) => {
        const patient = patients[r.patientId]
        const patientName = patient ? `Report for ${patient.fname ?? ''} ${patient.lname ?? ''}`.trim() : 'Loading patient...'

        let formattedDate = 'Unknown date'
        try {
          formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
        } catch (err) {
          console.error('Failed to load doctors:', err)
        }

        return (
          <div className='report-card' key={r.id}>
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
      })}
    </div>
  )
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [docList, setDocList] = useState([])
  const [patList, setPatList] = useState([])
  const [patients, setPatients] = useState({})
  const [reports, setReports] = useState([])
  const [pendingApts, setPendingApts] = useState([])
  const [fulfilledApts, setFulfilledApts] = useState([])

  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [loadingApts, setLoadingApts] = useState(false)
  const [loadingReports, setLoadingReports] = useState(false)

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const res = await getAllDoctors()
        setDocList(res.data)
      } catch (err) {
        console.error('Failed to load doctors:', err)
      } finally {
        setLoadingDoctors(false)
      }
    }
    fetchDoctors()
  }, [])

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true)
      try {
        const res = await getAllPatients()
        setPatList(res.data)
      } catch (err) {
        console.error('Failed to load patients:', err)
      } finally {
        setLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [])

  // Fetch appointments
  useEffect(() => {
    const fetchApts = async () => {
      setLoadingApts(true)
      try {
        const pendingRes = await listPendingApts()
        const fulfilledRes = await listFulfilledApts()
        setPendingApts(pendingRes.data)
        setFulfilledApts(fulfilledRes.data)
      } catch (err) {
        console.error('Failed to load appointments:', err)
      } finally {
        setLoadingApts(false)
      }
    }
    fetchApts()
  }, [])

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true)
      try {
        const res = await listReports()
        setReports(res.data || [])
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setLoadingReports(false)
      }
    }
    fetchReports()
  }, [])

  // Fetch patients for reports
  useEffect(() => {
    if (!reports.length) return
    const fetchPatientsForReports = async () => {
      const uniqueIds = [...new Set(reports.map((r) => r.patientId))]
      try {
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
        console.error('Failed to fetch patients for reports:', err)
      }
    }
    fetchPatientsForReports()
  }, [reports])

  return (
    <div className='admin-page'>
      {/* Sidebar */}
      <aside className='admin-sidebar'>
        <h2 className='logo'>Admin Panel</h2>
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={activeTab === 'onboard' ? 'active' : ''} onClick={() => setActiveTab('onboard')}>
            Onboard
          </li>
          <li className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>
            Doctors
          </li>
          <li className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
            Patients
          </li>
          <li className={activeTab === 'pappointments' ? 'active' : ''} onClick={() => setActiveTab('pappointments')}>
            Pending Appointments
          </li>
          <li className={activeTab === 'fappointments' ? 'active' : ''} onClick={() => setActiveTab('fappointments')}>
            Fulfilled Appointments
          </li>
          <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
            Reports
          </li>
        </ul>
        {/* Logout Button */}
        <Logout />
      </aside>

      {/* Main content */}
      <main className='admin-main'>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className='tab-content'>
            <h1>Dashboard</h1>

            {/* Summary Cards */}
            <div className='dashboard-cards'>
              <div className='card'>
                <FontAwesomeIcon icon={faUserMd} className='card-icon' />
                <h2>{docList?.length ?? 0}</h2>
                <p>Doctors</p>
              </div>
              <div className='card'>
                <FontAwesomeIcon icon={faUser} className='card-icon' />
                <h2>{patList?.length ?? 0}</h2>
                <p>Patients</p>
              </div>
              <div className='card'>
                <FontAwesomeIcon icon={faClock} className='card-icon' />
                <h2>{pendingApts?.length ?? 0}</h2>
                <p>Pending Appointments</p>
              </div>
              <div className='card'>
                <FontAwesomeIcon icon={faCheckCircle} className='card-icon' />
                <h2>{fulfilledApts?.length ?? 0}</h2>
                <p>Fulfilled Appointments</p>
              </div>
              <div className='card'>
                <FontAwesomeIcon icon={faFileAlt} className='card-icon' />
                <h2>{reports?.length ?? 0}</h2>
                <p>Reports</p>
              </div>
            </div>

            {/* Latest Reports */}
            <div className='dashboard-latest'>
              <h3>Latest Reports</h3>
              {reports?.length === 0 ? (
                <p>No recent reports</p>
              ) : (
                <div>
                  <div className='reports-list'>
                    {reports.slice(0, 5).map((r) => {
                      const patient = patients[r.patientId]
                      const patientName = patient ? `${patient.fname} ${patient.lname}` : 'Unknown patient'

                      let formattedDate = 'Unknown date'
                      try {
                        formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
                      } catch (err) {
                        console.error('Failed to load doctors:', err)
                      }

                      return (
                        <div className='report-card latest' key={r.id}>
                          <div className='report-info'>
                            <FontAwesomeIcon icon={faFile} className='report-icon' />
                            <div className='report-text'>
                              <span className='report-link'>{patientName}</span>
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

                  {/* View All Reports Button */}
                  <div className='view-all-wrapper'>
                    <button className='view-all-btn' onClick={() => setActiveTab('reports')}>
                      View All Reports →
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Latest fulfuiled appointment */}
            <div className='dashboard-latest'>
              <h3>Latest Fulfilled Appointments</h3>
              {fulfilledApts?.length === 0 ? (
                <p>No recent fulfilled appointments</p>
              ) : (
                <div>
                  <div className='reports-list'>
                    {fulfilledApts.slice(0, 5).map((apt) => {
                      const fullName = apt.message?.fullName || 'Unknown patient'

                      let formattedDate = 'Unknown date'
                      try {
                        if (apt.message?.date) {
                          formattedDate = format(parseISO(apt.message.date), 'MMM dd, yyyy HH:mm')
                        }
                      } catch (err) {
                        console.error('Failed to load fulfiled appointment:', err)
                      }

                      return (
                        <div className='report-card fulfilled' key={apt.id}>
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

                  {/* View All Fulfilled Button */}
                  <div className='view-all-wrapper'>
                    <button className='view-all-btn' onClick={() => setActiveTab('fappointments')}>
                      View All Fulfilled →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Latest Pending Appointments */}
            <div className='dashboard-latest'>
              <h3>Latest Pending Appointments</h3>
              {pendingApts?.length === 0 ? (
                <p>No recent pending appointments</p>
              ) : (
                <div>
                  <div className='reports-list'>
                    {pendingApts.slice(0, 5).map((apt) => {
                      const fullName = apt.message?.fullName || 'Unknown patient'

                      let formattedDate = 'Unknown date'
                      try {
                        if (apt.message?.date) {
                          formattedDate = format(parseISO(apt.message.date), 'MMM dd, yyyy HH:mm')
                        }
                      } catch (err) {
                        console.error('Failed to load doctors:', err)
                      }
                      return (
                        <div className='report-card pending' key={apt.id}>
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

                  {/* View All Pending Button */}
                  <div className='view-all-wrapper'>
                    <button className='view-all-btn' onClick={() => setActiveTab('pappointments')}>
                      View All Pending →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctors */}
        {activeTab === 'doctors' && (
          <div className='tab-content'>
            <h1>Doctors</h1>
            <p>List of registered doctors.</p>
            {loadingDoctors ? (
              <Spinner />
            ) : docList?.length === 0 ? (
              <p>No doctors found</p>
            ) : (
              <div className='reports-list'>
                {docList.map((doc) => (
                  <div className='report-card doctor' key={doc.id}>
                    <div className='report-info'>
                      <FontAwesomeIcon icon={faUserMd} className='report-icon' />
                      <div className='report-text'>
                        <span className='report-link'>
                          {doc.fname} {doc.lname}
                        </span>
                      </div>
                    </div>
                    <div className='report-time'>
                      <FontAwesomeIcon icon={faClock} className='time-icon' />
                      <span>{doc.createdAt ? format(parseISO(doc.createdAt), 'MMM dd, yyyy') : 'Unknown date'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onboard */}
        {activeTab === 'onboard' && (
          <div className='tab-content doctor-tab'>
            <DocSignUp />
          </div>
        )}

        {/* Patients */}
        {activeTab === 'patients' && (
          <div className='tab-content'>
            <h1>Patients</h1>
            <p>Manage all patient records here.</p>
            {loadingPatients ? (
              <Spinner />
            ) : patList?.length === 0 ? (
              <p>No patients found</p>
            ) : (
              <div className='reports-list'>
                {patList.map((pat) => (
                  <div className='report-card patient' key={pat.id}>
                    <div className='report-info'>
                      <FontAwesomeIcon icon={faUser} className='report-icon' />
                      <div className='report-text'>
                        <span className='report-link'>
                          {pat.fname} {pat.lname}
                        </span>
                      </div>
                    </div>
                    <div className='report-time'>
                      <FontAwesomeIcon icon={faClock} className='time-icon' />
                      <span>{pat.createdAt ? format(parseISO(pat.createdAt), 'MMM dd, yyyy') : 'Unknown date'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pappointments' && (
          <div className='tab-content'>
            <h1>Pending Appointments</h1>
            {loadingApts ? (
              <Spinner />
            ) : pendingApts?.length === 0 ? (
              <p>No pending appointments</p>
            ) : (
              <div className='reports-list'>
                {pendingApts.map((apt) => {
                  const fullName = apt.message?.fullName || 'Unknown patient'

                  // Validate date before formatting
                  let formattedDate = 'Unknown date'
                  try {
                    const d = parseISO(apt.message?.date)
                    if (isValid(d)) {
                      formattedDate = format(d, 'MMM dd, yyyy HH:mm')
                    }
                  } catch (err) {
                    console.error('Failed to load doctors:', err)
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

        {activeTab === 'fappointments' && (
          <div className='tab-content'>
            <h1>Fulfilled Appointments</h1>
            {loadingApts ? (
              <Spinner />
            ) : fulfilledApts?.length === 0 ? (
              <p>No fulfilled appointments</p>
            ) : (
              <div className='reports-list'>
                {fulfilledApts.map((apt) => {
                  const aptMessage = apt.message || {} // fallback to empty object
                  const fullName = aptMessage.fullName || 'Unknown patient'

                  let formattedDate = 'Unknown date'
                  if (aptMessage.date) {
                    try {
                      const parsedDate = parseISO(aptMessage.date)
                      if (!isNaN(parsedDate)) {
                        formattedDate = format(parsedDate, 'MMM dd, yyyy HH:mm')
                      }
                    } catch (err) {
                      console.warn('Invalid date:', aptMessage.date, err)
                    }
                  }

                  return (
                    <div className='report-card fulfilled' key={apt.id}>
                      <div className='report-info'>
                        <FontAwesomeIcon icon={faCheckCircle} className='report-icon' />
                        <div className='report-text'>
                          <span className='report-link'>{fullName}</span>
                        </div>
                      </div>
                      <div className='report-time'>
                        <FontAwesomeIcon icon={faCheckCircle} className='time-icon' />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className='tab-content'>
            <h1>Reports</h1>
            <ReportList reports={reports} patients={patients} loading={loadingReports} />
          </div>
        )}
      </main>
    </div>
  )
}
