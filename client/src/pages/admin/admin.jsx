import { useEffect, useState } from 'react'
import './admin.css'
import {
  getAllDoctors,
  getAllPatients,
  getPatientById,
  listFulfilledApts,
  listPendingApts,
  listReports,
  changeAdminPassword,
  getAdminById
} from '../../apis'
import { DocSignUp } from '../signup/docSignUp'
import { format, parseISO } from 'date-fns'
import { isValid } from 'date-fns'
import { faClock, faFile, faUserMd, faUser, faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Logout } from '../login/login'
import { Summary } from '../../components/summary' // Import the Summary component
import { jwtDecode } from 'jwt-decode'

// Spinner component
function Spinner() {
  return (
    <div className='tab-spinner-overlay'>
      <div className='tab-spinner'></div>
      <p>Loading...</p>
    </div>
  )
}

// Updated ReportList component with inline summary functionality
function ReportList({ reports, patients, loading, onReportSelect, selectedReport, onBack }) {
  if (loading) return <Spinner />

  // If a report is selected, show the Summary component
  if (selectedReport) {
    return <Summary report={selectedReport} onBack={onBack} />
  }

  // Otherwise show the reports list
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
          console.error('Failed to format date:', err)
        }

        return (
          <div
            className='report-card'
            key={r.id}
            onClick={() => onReportSelect(r)} // Click to show summary
            style={{ cursor: 'pointer' }} // Visual indicator
          >
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
  const [selectedReport, setSelectedReport] = useState(null) // New state for selected report

  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [loadingApts, setLoadingApts] = useState(false)
  const [loadingReports, setLoadingReports] = useState(false)

  // Settings states
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  console.log('Profile:', loadingProfile)

  // Get logged in admin/doctor ID
  const token = localStorage.getItem('access')
  const decoded = token ? jwtDecode(token) : null
  const loggedInUserId = decoded?.sub

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

  // Fetch profile for settings
  useEffect(() => {
    if (activeTab !== 'settings') return

    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await getAdminById(loggedInUserId)
        setProfile(res.data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoadingProfile(false)
      }
    }

    if (loggedInUserId) {
      fetchProfile()
    }
  }, [activeTab, loggedInUserId])

  // Handler for selecting a report
  const handleReportSelect = (report) => {
    setSelectedReport(report)
  }

  // Handler for going back to reports list
  const handleBackToReports = () => {
    setSelectedReport(null)
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return alert('New password and confirmation do not match!')
    }

    try {
      setChangingPassword(true)
      const user = jwtDecode(localStorage.getItem('access'))
      // console.log(user.id)
      const pass = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        id: user.sub // Use the logged-in user's ID
      }
      const res = await changeAdminPassword(pass)

      if (res.success) {
        alert('Password changed successfully!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert(res.message || 'Password change failed')
      }
    } catch (err) {
      console.error('Error changing password', err)
      alert('Something went wrong')
    } finally {
      setChangingPassword(false)
    }
  }

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
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            Settings
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
                        console.error('Failed to format date:', err)
                      }

                      return (
                        <div
                          className='report-card latest'
                          key={r.id}
                          onClick={() => {
                            setSelectedReport(r)
                            setActiveTab('reports') // Switch to reports tab
                          }}
                          style={{ cursor: 'pointer' }}
                        >
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

            {/* Latest fulfilled appointment */}
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
                        console.error('Failed to format date:', err)
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
                        console.error('Failed to format date:', err)
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
                    console.error('Failed to format date:', err)
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

        {/* Reports - Updated to use inline summary */}
        {activeTab === 'reports' && (
          <div className='tab-content'>
            <h1>Reports</h1>
            <ReportList
              reports={reports}
              patients={patients}
              loading={loadingReports}
              onReportSelect={handleReportSelect}
              selectedReport={selectedReport}
              onBack={handleBackToReports}
            />
          </div>
        )}

        {/* Settings - New tab similar to main.jsx */}
        {activeTab === 'settings' && (
          <div className='tab-content'>
            <h2>Settings</h2>
            <div className='settings-section'>
              {/* Display profile info */}
              {loadingProfile ? (
                <Spinner />
              ) : (
                <div className='profile-info'>
                  <p>
                    <strong>First Name:</strong> {profile?.fname}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {profile?.lname}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile?.phone}
                  </p>
                </div>
              )}
              <div className='baseline1'></div>

              {/* Change Password */}
              <div className='profile-info-s'>
                <h3 className='center'>Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div>
                    <label>Old Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label>New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label>Confirm</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className='buttons-sec-s'>
                    <button type='button' onClick={() => setShowPassword(!showPassword)} className='btn btn-secondary'>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>

                    <button className='btn btn-primary' type='submit' disabled={changingPassword}>
                      {changingPassword ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
