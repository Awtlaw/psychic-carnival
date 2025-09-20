import {
  assignDoctor,
  bookApt,
  checkSymptoms,
  getPatientById,
  getDoctorById,
  listPendingApts,
  listReports,
  writeReport,
  uploadPfp,
  // getUserPfp,
  changePatientInfo,
  changePatientPassword
} from '../apis'
import { useEffect, useState } from 'react'
import './main.css'
import { jwtDecode } from 'jwt-decode'
import { faClock, faFile } from '@fortawesome/free-solid-svg-icons'
import { format, isValid, parseISO } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Link } from 'react-router-dom'
import { Logout } from '../pages/login/login'
import { Summary } from './summary'

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
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [userPfp, setUserPfp] = useState(null) // stores profile picture URL
  const [selectedFile, setSelectedFile] = useState(null) // file chosen by user
  const [uploading, setUploading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ phone: '', address: '' })
  const [selectedReport, setSelectedReport] = useState(null)
  const [doctors, setDoctors] = useState({})

  console.log('loadingProfile:', loadingProfile) // loading state for profile fetch

  // form state for contact info
  // Decode user ID
  const { sub: userId } = jwtDecode(localStorage.getItem('access'))
  // console.log(getUserPfp)
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }
  // Get logged in user ID
  const token = localStorage.getItem('access')
  const decoded = token ? jwtDecode(token) : null
  const loggedInUserId = decoded?.sub
  //  Save updated contact info
  const handleSave = async () => {
    try {
      const res = await changePatientInfo(form)
      if (res.success) {
        alert('Profile updated successfully!')
        setProfile((prev) => ({ ...prev, ...form })) // update UI
      } else {
        alert(res.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating profile')
    }
  }

  // console.log(loadingProfile)
  const handlePfpChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }
  // upload profile picture
  const handlePfpUpload = async () => {
    if (!selectedFile) return alert('Please select a file!')

    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('email', profile?.email)

    setUploading(true)
    try {
      const res = await uploadPfp(formData)
      if (res.success) {
        alert('Profile picture uploaded successfully!')
        setUserPfp(res.imageUrl)

        // Trigger animation on profile picture
        const imgEl = document.querySelector('.profile-picture img')
        if (imgEl) {
          imgEl.classList.remove('update-animation') // reset animation
          void imgEl.offsetWidth // trigger reflow
          imgEl.classList.add('update-animation') // apply animation
        }
      } else {
        alert(res.message || 'Upload failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }
  // handle symptom input change
  const handleSymptomChange = (e) => setSymptoms(e.target.value)
  // handle symptom form submit
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
  // handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return alert('New password and confirmation do not match!')
    }

    try {
      setChangingPassword(true)
      const user = jwtDecode(localStorage.getItem('access'))
      console.log(user)
      // call change password api
      const res = await changePatientPassword({
        email: user.email,
        oldPwd: oldPassword,
        newPwd: newPassword
      })

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
  // fetch doctors for pending appointments
  useEffect(() => {
    if (pendingAppointments.length === 0) return

    const fetchDoctors = async () => {
      try {
        const uniqueIds = [...new Set(pendingAppointments.map((apt) => apt.doctorId))]
        const entries = await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const doctor = await getDoctorById(id)
              return [id, doctor?.data || null]
            } catch {
              return [id, null]
            }
          })
        )
        setDoctors(Object.fromEntries(entries))
      } catch (err) {
        console.error('Failed to load doctors:', err)
      }
    }

    fetchDoctors()
  }, [pendingAppointments])

  // fetch reports on component mount
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
  // fetch profile
  useEffect(() => {
    if (activeTab !== 'profile' && activeTab !== 'settings') return

    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        const { sub: patientId } = jwtDecode(localStorage.getItem('access'))
        const res = await getPatientById(patientId)
        setProfile(res.data)

        // ✅ pre-fill form
        setForm({
          phone: res.data.phone || '',
          address: res.data.address || ''
        })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [activeTab])

  // fetch profile picture
  useEffect(() => {
    const fetchPfp = async () => {
      try {
        // const res = await getUserPfp(userId)

        setUserPfp(null)
      } catch (err) {
        console.error('Failed to fetch profile picture', err)
      }
    }
    fetchPfp()
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
            ✅ Symptom checker
          </li>

          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            👨‍⚕️ Profile
          </li>
          <li className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
            📝 Medical Reports
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
      {/* History */}
      {activeTab === 'history' && (
        <div className='main-body'>
          {selectedReport ? (
            // ✅ Show the summary for the selected report
            <Summary report={selectedReport} onBack={() => setSelectedReport(null)} />
          ) : (
            // ✅ Otherwise show the reports list
            <>
              {reportsList.length > 0 ? (
                <>
                  <h3>Your Reports</h3>
                  {reportsList
                    .filter((r) => r.patientId === loggedInUserId) // show only this user's reports
                    .map((r) => {
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
                          onClick={() => setSelectedReport(r)} // 👈 swap reports list with summary
                        >
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
                </>
              ) : (
                <div className='no-records'>
                  <h3>No Reports Found</h3>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Appointment */}
      {activeTab === 'appointments' && (
        <div className='main-body'>
          <h1>Pending Appointments</h1>
          {loadingApts ? (
            <Spinner />
          ) : pendingAppointments?.length === 0 ? (
            <p>No pending appointments</p>
          ) : (
            <div className='main-body'>
              {pendingAppointments
                .filter((r) => r.patientId === loggedInUserId) // ✅ only this user’s appointments
                .map((apt) => {
                  // 👇 Lookup doctor info if you have it in state (doctors object or array)
                  const doctor = doctors?.[apt.doctorId]
                  const doctorName = doctor ? `Dr. ${doctor.fname ?? ''} ${doctor.lname ?? ''}`.trim() : 'Assigned Doctor'

                  // Format appointment date safely
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
                          You have an appointment with {doctorName} on {formattedDate} ({apt.message?.period})
                        </div>
                        <div className='report-text'>Reason: {apt.message?.reason || 'N/A'}</div>
                        <div className='report-text'>Status: {apt.status || 'Pending'}</div>
                      </div>
                      <div className='report-time'>
                        <div className='buttons-sec'></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {activeTab === 'profile' && (
        <div className='main-body'>
          <h2>Your Profile</h2>

          {/* Display current profile picture */}
          <div className='profile-picture'>
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : userPfp || `http://localhost:5173/api/upload/image/${userId}`}
              alt='Profile'
              style={{ width: '120px', height: '120px', borderRadius: '50%' }}
            />
          </div>

          <div className='upload-section'>
            <input type='file' accept='image/*' onChange={handlePfpChange} />
            <button className='btn btn-primary' onClick={handlePfpUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

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
            <p>
              <strong>Date of Birth:</strong> {profile?.dob}
            </p>
            <p>
              <strong>Sex:</strong> {profile?.sex}
            </p>
            <p>
              <strong>Address:</strong> {profile?.address}
            </p>
          </div>
        </div>
      )}
      {/* settings tab */}
      {activeTab === 'settings' && (
        <div className='main-body'>
          <h2>Settings</h2>
          <div className='settings-section'>
            {/* Update Contact Info */}
            <div className='profile-info-s'>
              <h3 className='center'>Update Contact Info</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                <div>
                  <label>Phone</label>
                  <input type='text' name='phone' value={form.phone} onChange={handleChange} />
                </div>

                <div>
                  <label>Address</label>
                  <input type='text' name='address' value={form.address} onChange={handleChange} />
                </div>

                <button className='btn btn-primary' type='submit'>
                  Save Changes
                </button>
              </form>
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
  )
}
