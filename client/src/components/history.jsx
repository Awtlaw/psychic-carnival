// import { faClock, faFile, faCalendarCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './history.css'
// import { useEffect, useState } from 'react'
// import Modal from 'react-modal'
// import { listReports, getPatientById, listPendingApts, changeDocPassword, getDoctorById } from '../apis'
// import { parseISO, format, isValid } from 'date-fns'
// import { jwtDecode } from 'jwt-decode'
// import { Logout } from '../pages/login/login'
// import { Link } from 'react-router-dom'

// export function History() {
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [reportsList, setReportsList] = useState([])
//   const [patients, setPatients] = useState({})
//   const [pendingAppointments, setPendingAppointments] = useState([])
//   const [loadingApts, setLoadingApts] = useState(false)
//   const [oldPassword, setOldPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [changingPassword, setChangingPassword] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [profile, setProfile] = useState(null)
//   const [showModal, setShowModal] = useState(false)
//   const [loadingProfile, setLoadingProfile] = useState(false)
//   const [showPasswordModal, setShowPasswordModal] = useState(false)

//   console.log(loadingProfile)
//   // Decode doctor ID
//   let loggedInDoc = null
//   try {
//     const token = localStorage.getItem('access')
//     loggedInDoc = token ? jwtDecode(token).sub : null
//   } catch (err) {
//     console.error('Invalid token:', err)
//   }
//   // Get logged in user ID
//   const token = localStorage.getItem('access')
//   const decoded = token ? jwtDecode(token) : null
//   const loggedInUserId = decoded?.sub

//   // Fetch reports
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const res = await listReports()
//         setReportsList(res.data || [])
//       } catch (err) {
//         console.error('Failed to load reports:', err)
//       }
//     }
//     fetchReports()
//   }, [])
//   // must change password modal
//   // Fetch profile (runs on mount + tab change)
//   useEffect(() => {
//     if (!loggedInDoc) return

//     const fetchProfile = async () => {
//       setLoadingProfile(true)
//       try {
//         const res = await getDoctorById(loggedInDoc)
//         console.log('Profile response:', res.data)

//         setProfile(res.data)

//         // ✅ force password change popup
//         if (res.data.mustChangePassword) {
//           setShowModal(true)
//         }
//       } catch (err) {
//         console.error('Failed to fetch profile:', err)
//       } finally {
//         setLoadingProfile(false)
//       }
//     }

//     fetchProfile()
//   }, [activeTab, loggedInDoc])

//   useEffect(() => {
//     const fetchApts = async () => {
//       setLoadingApts(true)
//       try {
//         const pendingRes = await listPendingApts()

//         setPendingAppointments(pendingRes.data)
//       } catch (err) {
//         console.error('Failed to load appointments:', err)
//       } finally {
//         setLoadingApts(false)
//       }
//     }
//     fetchApts()
//   }, [])

//   // Fetch patients
//   useEffect(() => {
//     if (reportsList.length === 0) return
//     const fetchPatients = async () => {
//       try {
//         const uniqueIds = [...new Set(reportsList.map((r) => r.patientId))]
//         const entries = await Promise.all(
//           uniqueIds.map(async (id) => {
//             try {
//               const patient = await getPatientById(id)
//               return [id, patient?.data || null]
//             } catch {
//               return [id, null]
//             }
//           })
//         )
//         setPatients(Object.fromEntries(entries))
//       } catch (err) {
//         console.error('Failed to load patients:', err)
//       }
//     }
//     fetchPatients()
//   }, [reportsList])

//   // Filter reports for logged-in doctor
//   const doctorReports = reportsList.filter((r) => r.doctorId === loggedInDoc)

//   // Metrics
//   const totalReports = doctorReports.length
//   const recentReports = doctorReports.slice(-5).reverse()
//   // const today = new Date()
//   const todayAppointments = 0 // placeholder for future API

//   const handlePasswordChange = async (e) => {
//     e.preventDefault()
//     if (newPassword !== confirmPassword) {
//       return alert('New password and confirmation do not match!')
//     }

//     try {
//       setChangingPassword(true)
//       const user = jwtDecode(localStorage.getItem('access'))

//       const res = await changeDocPassword({
//         email: user.email,
//         oldPwd: oldPassword,
//         newPwd: newPassword
//       })

//       if (res.success) {
//         alert('Password changed successfully!')
//         setOldPassword('')
//         setNewPassword('')
//         setConfirmPassword('')
//         setShowModal(false) // 👈 close modal after success
//       } else {
//         alert(res.message || 'Password change failed')
//       }
//     } catch (err) {
//       console.error('Error changing password', err)
//       alert('Something went wrong')
//     } finally {
//       setChangingPassword(false)
//     }
//   }

//   return (
//     <div className='layout2'>
//       {/* Sidebar */}
//       <aside className='sidebar1'>
//         <h2>HealthConnect</h2>
//         <ul>
//           <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
//             🏠 Dashboard
//           </li>
//           <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
//             📝 Patients Reports
//           </li>
//           <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
//             📅 Appointments
//           </li>
//           <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
//             ⚙ Settings
//           </li>
//         </ul>
//         <Logout />
//       </aside>

//       {/* Main Content */}
//       <div className='history-container'>
//         {activeTab === 'dashboard' && (
//           <>
//             <h2 className='history-title'>📊 Dashboard</h2>
//             <hr />

//             {/* Metrics Cards */}
//             <div className='dashboard-metrics'>
//               <div className='metric-card'>
//                 <FontAwesomeIcon icon={faFile} className='metric-icon' />
//                 <div>Total Reports</div>
//                 <div className='metric-value'>{totalReports}</div>
//               </div>
//               <div className='metric-card'>
//                 <FontAwesomeIcon icon={faCalendarCheck} className='metric-icon' />
//                 <div>Today's Appointments</div>
//                 <div className='metric-value'>{todayAppointments}</div>
//               </div>
//               <div className='metric-card'>
//                 <FontAwesomeIcon icon={faHourglassHalf} className='metric-icon' />
//                 <div>Pending Reports</div>
//                 <div className='metric-value'>{0}</div> {/* Placeholder */}
//               </div>
//             </div>

//             {/* Recent Reports */}
//             <h3>Recent Reports</h3>
//             {recentReports.length > 0 ? (
//               <div className='reports-list'>
//                 {recentReports.map((r) => {
//                   const patient = patients[r.patientId]
//                   const patientName = patient ? `${patient.fname} ${patient.lname}` : 'Loading patient...'
//                   let formattedDate = 'Unknown date'
//                   try {
//                     formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
//                   } catch (err) {
//                     console.log('feild to load recent report', err)
//                   }
//                   return (
//                     <div className='report-card' key={r.id}>
//                       <div className='report-info'>
//                         <FontAwesomeIcon icon={faFile} className='report-icon' />
//                         <div className='report-text'>{patientName}</div>
//                       </div>
//                       <div className='report-time'>
//                         <FontAwesomeIcon icon={faClock} className='time-icon' />
//                         <span>{formattedDate}</span>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             ) : (
//               <div className='no-records'>
//                 <h3>No Recent Reports</h3>
//               </div>
//             )}
//           </>
//         )}

//         {activeTab === 'reports' &&
//           (() => {
//             const doctorReports = reportsList.filter((r) => r.doctorId === loggedInUserId)

//             return (
//               <div className='reports-list'>
//                 {doctorReports.length > 0 ? (
//                   <>
//                     <h3>Reports</h3>
//                     {doctorReports.map((r) => {
//                       const patient = patients[r.patientId]
//                       const patientName = patient ? `Report for ${patient.fname ?? ''} ${patient.lname ?? ''}`.trim() : 'Loading patient...'

//                       let formattedDate = 'Unknown date'
//                       try {
//                         formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
//                       } catch {
//                         console.warn('Invalid date for report:', r.createdAt)
//                       }

//                       return (
//                         <div className='report-card' key={r.id ?? Math.random()}>
//                           <div className='report-info'>
//                             <FontAwesomeIcon icon={faFile} className='report-icon' />
//                             <div className='report-text'>
//                               <Link to={`/reports/${r.id}`} className='report-link'>
//                                 {patientName}
//                               </Link>
//                             </div>
//                           </div>
//                           <div className='report-time'>
//                             <FontAwesomeIcon icon={faClock} className='time-icon' />
//                             <span>{formattedDate}</span>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </>
//                 ) : (
//                   <>
//                     <h3>No Reports Found</h3>
//                     <div className='no-records'>
//                       <p>You don’t have any reports yet.</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )
//           })()}

//         {activeTab === 'appointments' && (
//           <div className='tab-content'>
//             {loadingApts ? (
//               <Spinner />
//             ) : (
//               (() => {
//                 const doctorApts = pendingAppointments?.filter((apt) => apt.doctorId === loggedInUserId) || []

//                 return doctorApts.length === 0 ? (
//                   <h1>No pending appointments</h1>
//                 ) : (
//                   <>
//                     <h1>Pending Appointments</h1>
//                     <div className='reports-list'>
//                       {doctorApts.map((apt) => {
//                         const fullName = apt.message?.fullName || 'Unknown patient'

//                         let formattedDate = 'Unknown date'
//                         try {
//                           const d = parseISO(apt.message?.date)
//                           if (isValid(d)) {
//                             formattedDate = format(d, 'MMM dd, yyyy HH:mm')
//                           }
//                         } catch (err) {
//                           console.warn('Invalid date:', apt.message?.date, err)
//                         }

//                         return (
//                           <div className='report-card' key={apt.id}>
//                             <div className='report-info'>
//                               <FontAwesomeIcon icon={faClock} className='report-icon' />
//                               <div className='report-text'>
//                                 <span className='report-link'>{fullName}</span>
//                               </div>
//                             </div>
//                             <div className='report-time'>
//                               <FontAwesomeIcon icon={faClock} className='time-icon' />
//                               <span>{formattedDate}</span>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </>
//                 )
//               })()
//             )}
//           </div>
//         )}

//         {activeTab === 'settings' && (
//           <div className='main-body'>
//             <h2>Settings</h2>
//             <div className='settings-section'>
//               {/* Update Contact Info */} {/* Display username/email or other info */}
//               <div className='profile-info'>
//                 <p>
//                   <strong>First Name:</strong> {profile?.fname}
//                 </p>
//                 <p>
//                   <strong>Last Name:</strong> {profile?.lname}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {profile?.email}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {profile?.phone}
//                 </p>
//               </div>
//               <div className='baseline1'></div>
//               {/* Change Password */}
//               <div className='profile-info-s'>
//                 <h3 className='center'>Change Password</h3>
//                 <form onSubmit={handlePasswordChange}>
//                   <div>
//                     <label>Old Password</label>
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={oldPassword}
//                       onChange={(e) => setOldPassword(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label>New Password</label>
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label>Confirm</label>
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className='buttons-sec-s'>
//                     <button type='button' onClick={() => setShowPassword(!showPassword)} className='btn btn-secondary'>
//                       {showPassword ? 'Hide' : 'Show'}
//                     </button>

//                     <button className='btn btn-primary' type='submit' disabled={changingPassword}>
//                       {changingPassword ? 'Updating...' : 'Change Password'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Modal isOpen={showModal} ariaHideApp={false} className='modal'>
//         <h2>Change Your Temporary Password</h2>
//         <form onSubmit={handlePasswordChange}>
//           <div>
//             <label>Old Password</label>
//             <input
//               type={showPasswordModal ? 'text' : 'password'}
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label>New Password</label>
//             <input
//               type={showPasswordModal ? 'text' : 'password'}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label>Confirm Password</label>
//             <input
//               type={showPasswordModal ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className='buttons-sec-s'>
//             <button type='button' onClick={() => setShowPasswordModal(!showPasswordModal)} className='btn btn-secondary'>
//               {showPasswordModal ? 'Hide' : 'Show'}
//             </button>
//             <button className='btn btn-primary' type='submit' disabled={changingPassword}>
//               {changingPassword ? 'Updating...' : 'Change Password'}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

import { faClock, faFile, faCalendarCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { listReports, getPatientById, listPendingApts, changeDocPassword, getDoctorById } from '../apis'
import { parseISO, format, isValid } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { Logout } from '../pages/login/login'
import { Summary } from './summary' // Import the Summary component

export function History() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({})
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loadingApts, setLoadingApts] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null) // New state for selected report

  console.log(loadingProfile)
  // Decode doctor ID
  let loggedInDoc = null
  try {
    const token = localStorage.getItem('access')
    loggedInDoc = token ? jwtDecode(token).sub : null
  } catch (err) {
    console.error('Invalid token:', err)
  }
  // Get logged in user ID
  const token = localStorage.getItem('access')
  const decoded = token ? jwtDecode(token) : null
  const loggedInUserId = decoded?.sub

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
  // fetch for pending appointment
  useEffect(() => {
    if (pendingAppointments.length === 0) return

    const fetchPatients = async () => {
      try {
        const uniqueIds = [...new Set(pendingAppointments.map((apt) => apt.patientId))]
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
  }, [pendingAppointments])

  // Fetch profile (runs on mount + tab change)
  useEffect(() => {
    if (!loggedInDoc) return

    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await getDoctorById(loggedInDoc)
        console.log('Profile response:', res.data)

        setProfile(res.data)

        // Force password change popup
        if (res.data.mustChangePassword) {
          setShowModal(true)
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [activeTab, loggedInDoc])

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
  const todayAppointments = 0 // placeholder for future API

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return alert('New password and confirmation do not match!')
    }

    try {
      setChangingPassword(true)
      const user = jwtDecode(localStorage.getItem('access'))

      const res = await changeDocPassword({
        email: user.email,
        oldPwd: oldPassword,
        newPwd: newPassword
      })

      if (res.success) {
        alert('Password changed successfully!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowModal(false)
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

  const Spinner = () => <div>Loading...</div>

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
            📝 Patients Reports
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
                <div className='metric-value'>{0}</div>
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
                    console.log('failed to load recent report', err)
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
            {selectedReport ? (
              // Show the summary for the selected report
              <Summary report={selectedReport} onBack={() => setSelectedReport(null)} />
            ) : (
              // Show the reports list
              (() => {
                const doctorReports = reportsList.filter((r) => r.doctorId === loggedInUserId)

                return doctorReports.length > 0 ? (
                  <>
                    <h3>Reports</h3>
                    {doctorReports.map((r) => {
                      const patient = patients[r.patientId]
                      const patientName = patient ? `Report for ${patient.fname ?? ''} ${patient.lname ?? ''}`.trim() : 'Loading patient...'

                      let formattedDate = 'Unknown date'
                      try {
                        formattedDate = format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')
                      } catch {
                        console.warn('Invalid date for report:', r.createdAt)
                      }

                      return (
                        <div
                          className='report-card'
                          key={r.id ?? Math.random()}
                          onClick={() => setSelectedReport(r)} // Click to show summary
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
                  </>
                ) : (
                  <>
                    <h3>No Reports Found</h3>
                    <div className='no-records'>
                      <p>You don't have any reports yet.</p>
                    </div>
                  </>
                )
              })()
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className='tab-content'>
            {loadingApts ? (
              <Spinner />
            ) : (
              (() => {
                // ✅ filter appointments for this doctor
                const doctorApts = pendingAppointments?.filter((apt) => apt.doctorId === loggedInUserId) || []

                return doctorApts.length === 0 ? (
                  <h1>No pending appointments</h1>
                ) : (
                  <>
                    <h1>Pending Appointments</h1>
                    <div className='reports-list'>
                      {doctorApts.map((apt) => {
                        const patient = patients[apt.patientId]
                        const fullName = patient
                          ? `${patient.sex === 'M' ? 'Mr.' : 'Mrs.'} ${patient.fname} ${patient.lname}`
                          : 'Unknown patient'
                        // console.log(patient)

                        // determine salutation based on gender
                        // let salutation = ''
                        // if (patient?.sex?.toLowerCase() === 'male') {
                        //   salutation = 'Mr.'
                        // } else if (patient?.sex?.toLowerCase() === 'female') {
                        //   salutation = 'Mrs.'
                        // } else {
                        //   salutation = '' // fallback if gender is not available
                        // }

                        // format date safely
                        let formattedDate = 'Unknown date'
                        try {
                          const d = parseISO(apt.message?.date)
                          if (isValid(d)) {
                            formattedDate = format(d, 'MMM dd, yyyy HH:mm')
                          }
                        } catch (err) {
                          console.warn('Invalid date:', apt.message?.date, err)
                        }

                        return (
                          <div className='report-card' key={apt.id}>
                            <div className='report-info'>
                              <FontAwesomeIcon icon={faClock} className='report-icon' />
                              <div className='report-text'>
                                <span className='report-link'>
                                  You have an appointment with {fullName} on {formattedDate} ({apt.message?.period})
                                </span>
                              </div>
                              <div className='report-text'>Status: {apt.status || 'Pending'}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className='main-body'>
            <h2>Settings</h2>
            <div className='settings-section'>
              {/* Display username/email or other info */}
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
      </div>

      <Modal isOpen={showModal} ariaHideApp={false} className='modal'>
        <h2>Change Your Temporary Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div>
            <label>Old Password</label>
            <input
              type={showPasswordModal ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type={showPasswordModal ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type={showPasswordModal ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className='buttons-sec-s'>
            <button type='button' onClick={() => setShowPasswordModal(!showPasswordModal)} className='btn btn-secondary'>
              {showPasswordModal ? 'Hide' : 'Show'}
            </button>
            <button className='btn btn-primary' type='submit' disabled={changingPassword}>
              {changingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
