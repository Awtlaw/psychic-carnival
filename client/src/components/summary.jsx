// import { useParams } from 'react-router-dom'
// import './summary.css'
// import { useEffect, useState } from 'react'
// import { getOneReport, getPatientById, updateReportNotes, fulfillReport } from '../apis'
// import { parseISO, format, differenceInYears } from 'date-fns'
// import { jwtDecode } from 'jwt-decode'
// import autoTable from 'jspdf-autotable'

// import jsPDF from 'jspdf' // 👈 for PDF download

// export function Summary() {
//   const { id } = useParams()
//   const [report, setReport] = useState(null)
//   const [patient, setPatient] = useState(null)
//   const [notes, setNotes] = useState('') // ✅ doctor’s notes
//   const [saving, setSaving] = useState(false)
//   const [role, setRole] = useState(null)
//   const [fulfilling, setFulfilling] = useState(false) // 👈 new state

//   useEffect(() => {
//     const token = localStorage.getItem('access')
//     if (token) {
//       const user = jwtDecode(token)
//       console.log('Decoded user:', user)
//       setRole(user?.role.toUpperCase())
//     }
//   }, [])

//   useEffect(() => {
//     async function fetchData() {
//       const { data } = await getOneReport(id)
//       data.diagnosis = JSON.parse(data.diagnosis)
//       console.log('Fetched report:', dat-a)
//       setReport(data)
//       setNotes(data.notes || '') // ✅ load existing notes if available

//       // fetch patient details
//       const patientRes = await getPatientById(data.patientId)
//       setPatient(patientRes.data)
//     }
//     fetchData()
//   }, [id])

//   if (!report || !patient) return <p>Loading...</p>

//   const diag = report.diagnosis
//   const age = differenceInYears(new Date(), new Date(patient.dob))

//   // ✅ Save doctor’s notes
//   const handleSaveNotes = async () => {
//     if (!notes.trim()) return alert('Notes cannot be empty')
//     try {
//       setSaving(true)
//       const { data } = await updateReportNotes(id, notes)
//       setReport(data) // update UI with new notes
//       alert('Notes saved successfully ✅')
//     } catch (err) {
//       console.error(err)
//       alert('Failed to save notes ❌')
//     } finally {
//       setSaving(false)
//     }
//   }
//   // ✅ Mark as Fulfilled
//   const handleFulfill = async () => {
//     try {
//       setFulfilling(true)
//       const { data } = await fulfillReport(id)
//       setReport(data) // update status in UI
//       alert('Report marked as Fulfilled ✅')
//     } catch (err) {
//       console.error(err)
//       alert('Failed to update status ❌')
//     } finally {
//       setFulfilling(false)
//     }
//   }

//   // ✅ Download as PDF
//   const handleDownload = () => {
//     const doc = new jsPDF()

//     // Header
//     doc.setFontSize(18)
//     doc.text('HealthConnect Medical Report', 14, 20)
//     doc.setFontSize(11)
//     doc.setTextColor(100)
//     doc.text('Confidential – For Patient Use Only', 14, 28)

//     let y = 40 // keep track of vertical position

//     // Patient Info Table
//     autoTable(doc, {
//       startY: y,
//       head: [['Field', 'Details']],
//       body: [
//         ['Name', `${patient.fname} ${patient.lname}`],
//         ['Age', `${age} years`],
//         ['Sex', patient.sex === 'M' ? 'Male' : 'Female'],
//         ['Email', patient.email],
//         ['Phone', patient.phone],
//         ['Address', patient.address],
//         ['Report Created', format(parseISO(report.createdAt), 'yyyy-MM-dd HH:mm')],
//         ['Status', report.status || 'Pending']
//       ],
//       theme: 'grid',
//       styles: { fontSize: 10 }
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Diagnosis Section
//     autoTable(doc, {
//       startY: y,
//       head: [['Diagnosis']],
//       body: [[diag.query]],
//       theme: 'striped',
//       styles: { fontSize: 11 }
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Possible Conditions
//     autoTable(doc, {
//       startY: y,
//       head: [['Possible Condition', 'Reason']],
//       body: diag.response.possible_conditions.map((c) => [c.name, c.reason]),
//       theme: 'grid',
//       styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 }
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Clinical Reasoning
//     autoTable(doc, {
//       startY: y,
//       head: [['Clinical Reasoning']],
//       body: [[diag.response.reasoning]],
//       styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 },
//       theme: 'plain'
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Recommendations
//     autoTable(doc, {
//       startY: y,
//       head: [['Recommendation', 'Details']],
//       body: [
//         ['Immediate Actions', diag.response.recommendations.immediate_actions],
//         ['When to Seek Care', diag.response.recommendations.when_to_seek_care],
//         ['Suggested Tests', diag.response.recommendations.tests.join(', ')]
//       ],
//       theme: 'grid',
//       styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 }
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Red Flags
//     autoTable(doc, {
//       startY: y,
//       head: [['Red Flags']],
//       body: diag.response.red_flags.map((flag) => [flag]),
//       theme: 'striped',
//       styles: { fontSize: 10 }
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Doctor’s Notes
//     autoTable(doc, {
//       startY: y,
//       head: [["Doctor's Notes"]],
//       body: [[notes || 'No notes available']],
//       styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 },
//       theme: 'plain'
//     })
//     y = doc.lastAutoTable.finalY + 10

//     // Footer
//     const pageHeight = doc.internal.pageSize.height
//     doc.setFontSize(10)
//     doc.text(`Report ID: ${report.id} | Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 10)

//     // Save file
//     doc.save(`Report_${patient.fname}_${patient.lname}.pdf`)
//   }

//   return (
//     <div className='doctor-container'>
//       <h2 className='doctor-title'>Doctor’s View</h2>
//       <hr />
//       <hr />

//       {/* Patient Info */}
//       <div className='doctor-section'>
//         <h3>Patient Info</h3>
//         <div className='doctor-grid'>
//           <div className='doctor-label'>Name:</div>
//           <div className='doctor-value'>
//             {patient.fname} {patient.lname}
//           </div>

//           <div className='doctor-label'>Age:</div>
//           <div className='doctor-value'>{age} years</div>

//           <div className='doctor-label'>Sex:</div>
//           <div className='doctor-value'>{patient.sex === 'M' ? 'Male' : 'Female'}</div>

//           <div className='doctor-label'>Email:</div>
//           <div className='doctor-value'>{patient.email}</div>

//           <div className='doctor-label'>Phone:</div>
//           <div className='doctor-value'>{patient.phone}</div>

//           <div className='doctor-label'>Address:</div>
//           <div className='doctor-value'>{patient.address}</div>

//           <div className='doctor-label'>Report Created:</div>
//           <div className='doctor-value'>{format(parseISO(report.createdAt), 'yyyy-MM-dd HH:mm')}</div>
//         </div>
//       </div>
//       <hr />
//       <hr />

//       {/* Symptom Report */}
//       <div className='doctor-section'>
//         <h3>Symptom Check Report</h3>
//         <div className='doctor-grid'>
//           <div className='doctor-label'>Patient’s Complaint:</div>
//           <div className='doctor-value'>{diag.query}</div>

//           <div className='doctor-label'>Confidence:</div>
//           <div className='doctor-value'>{diag.confidence}</div>

//           <div className='doctor-label'>Emergency Case:</div>
//           <div className='doctor-value'>{diag.isEmergency ? 'Yes' : 'No'}</div>
//         </div>
//       </div>
//       <hr />
//       <hr />

//       {/* Possible Conditions */}
//       <div className='doctor-section'>
//         <h3>Possible Conditions</h3>
//         <ul className='point'>
//           {diag.response.possible_conditions.map((c, idx) => (
//             <li key={idx}>
//               <b>{c.name}:</b> – {c.reason}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <hr />
//       <hr />

//       {/* Clinical Reasoning */}
//       <div className='doctor-section'>
//         <h3>Clinical Reasoning</h3>
//         <p>{diag.response.reasoning}</p>
//       </div>
//       <hr />
//       <hr />

//       {/* Recommendations */}
//       <div className='doctor-section'>
//         <h3>Recommendations</h3>
//         <ul className='point'>
//           <li>
//             <b>Immediate Actions:</b> {diag.response.recommendations.immediate_actions}
//           </li>
//           <li>
//             <b>When to Seek Care:</b> {diag.response.recommendations.when_to_seek_care}
//           </li>
//           <li>
//             <b>Suggested Tests:</b> {diag.response.recommendations.tests.join(', ')}
//           </li>
//         </ul>
//       </div>
//       <hr />
//       <hr />

//       {/* Red Flags */}
//       <div className='doctor-section'>
//         <h3>Red Flags</h3>
//         <ul className='point'>
//           {diag.response.red_flags.map((flag, idx) => (
//             <li key={idx}>{flag}</li>
//           ))}
//         </ul>
//       </div>
//       <hr />
//       <hr />

//       {/* Reference Cases */}
//       <div className='doctor-section'>
//         <h3>Reference Cases</h3>
//         <ul className='point'>
//           {diag.cases.map((c) => (
//             <li key={c.metadata.id}>
//               Patient {c.metadata.age}
//               {c.metadata.gender[0].toUpperCase()} → {c.metadata.diagnosis}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <hr />
//       <hr />
//       {/* ✅ Doctor’s Notes */}
//       <div className='doctor-section'>
//         <h3>Doctor’s Notes</h3>
//         {role === 'DOCTOR' ? (
//           <>
//             <textarea rows='4' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder='Enter your notes here...' />
//             <button className='btn btn-primary' onClick={handleSaveNotes} disabled={saving}>
//               {saving ? 'Saving...' : 'Save Notes'}
//             </button>
//           </>
//         ) : (
//           <p>{notes ? notes : 'No notes available yet.'}</p>
//         )}
//       </div>

//       {/* ✅ Actions for Doctor */}
//       {console.log(role)}
//       {role === 'DOCTOR' && (
//         <div className='doctor-section'>
//           {/* <h3>Actions</h3> */}
//           <button className='btn btn-success' onClick={handleFulfill} disabled={fulfilling}>
//             {fulfilling ? 'Updating...' : 'Mark as Fulfilled'}
//           </button>
//           {/* <button className='btn btn-secondary' onClick={handleDownload}>
//             Download Report (PDF)
//           </button> */}
//         </div>
//       )}
//       {/* Everyone can download */}
//       <div className='doctor-section'>
//         <button className='btn btn-secondary' onClick={handleDownload}>
//           Download Report (PDF)
//         </button>
//       </div>
//     </div>
//   )
// }

import './summary.css'
import { useEffect, useState } from 'react'
import { getOneReport, getPatientById, updateReportNotes, fulfillReport } from '../apis'
import { parseISO, format, differenceInYears } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf'

export function Summary({ report: propReport, onBack }) {
  const [report, setReport] = useState(propReport || null)
  const [patient, setPatient] = useState(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState(null)
  const [fulfilling, setFulfilling] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      const user = jwtDecode(token)
      console.log('Decoded user:', user)
      setRole(user?.role.toUpperCase())
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!report) return

      try {
        // If we have a full report object, use it directly
        let reportData = report

        // If we only have basic info, fetch full report details
        if (!report.diagnosis || typeof report.diagnosis === 'string') {
          const { data } = await getOneReport(report.id)
          data.diagnosis = JSON.parse(data.diagnosis)
          reportData = data
          setReport(reportData)
          // eslint-disable-next-line no-dupe-else-if
        } else if (typeof report.diagnosis === 'string') {
          // Parse diagnosis if it's still a string
          reportData = { ...report, diagnosis: JSON.parse(report.diagnosis) }
          setReport(reportData)
        }

        setNotes(reportData.notes || '')

        // Fetch patient details
        const patientRes = await getPatientById(reportData.patientId)
        setPatient(patientRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [report])

  if (!report || !patient) return <p>Loading...</p>

  const diag = report.diagnosis
  const age = differenceInYears(new Date(), new Date(patient.dob))

  // Save doctor's notes
  const handleSaveNotes = async () => {
    if (!notes.trim()) return alert('Notes cannot be empty')
    try {
      setSaving(true)
      const { data } = await updateReportNotes(report.id, notes)
      setReport(data)
      alert('Notes saved successfully ✅')
    } catch (err) {
      console.error(err)
      alert('Failed to save notes ❌')
    } finally {
      setSaving(false)
    }
  }

  // Mark as Fulfilled
  const handleFulfill = async () => {
    try {
      setFulfilling(true)
      const { data } = await fulfillReport(report.id)
      setReport(data)
      alert('Report marked as Fulfilled ✅')
    } catch (err) {
      console.error(err)
      alert('Failed to update status ❌')
    } finally {
      setFulfilling(false)
    }
  }

  // Download as PDF
  const handleDownload = () => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text('HealthConnect Medical Report', 14, 20)
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text('Confidential – For Patient Use Only', 14, 28)

    let y = 40

    // Patient Info Table
    autoTable(doc, {
      startY: y,
      head: [['Field', 'Details']],
      body: [
        ['Name', `${patient.fname} ${patient.lname}`],
        ['Age', `${age} years`],
        ['Sex', patient.sex === 'M' ? 'Male' : 'Female'],
        ['Email', patient.email],
        ['Phone', patient.phone],
        ['Address', patient.address],
        ['Report Created', format(parseISO(report.createdAt), 'yyyy-MM-dd HH:mm')],
        ['Status', report.status || 'Pending']
      ],
      theme: 'grid',
      styles: { fontSize: 10 }
    })
    y = doc.lastAutoTable.finalY + 10

    // Diagnosis Section
    autoTable(doc, {
      startY: y,
      head: [['Diagnosis']],
      body: [[diag.query]],
      theme: 'striped',
      styles: { fontSize: 11 }
    })
    y = doc.lastAutoTable.finalY + 10

    // Possible Conditions
    autoTable(doc, {
      startY: y,
      head: [['Possible Condition', 'Reason']],
      body: diag.response.possible_conditions.map((c) => [c.name, c.reason]),
      theme: 'grid',
      styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 }
    })
    y = doc.lastAutoTable.finalY + 10

    // Clinical Reasoning
    autoTable(doc, {
      startY: y,
      head: [['Clinical Reasoning']],
      body: [[diag.response.reasoning]],
      styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 },
      theme: 'plain'
    })
    y = doc.lastAutoTable.finalY + 10

    // Recommendations
    autoTable(doc, {
      startY: y,
      head: [['Recommendation', 'Details']],
      body: [
        ['Immediate Actions', diag.response.recommendations.immediate_actions],
        ['When to Seek Care', diag.response.recommendations.when_to_seek_care],
        ['Suggested Tests', diag.response.recommendations.tests.join(', ')]
      ],
      theme: 'grid',
      styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 }
    })
    y = doc.lastAutoTable.finalY + 10

    // Red Flags
    autoTable(doc, {
      startY: y,
      head: [['Red Flags']],
      body: diag.response.red_flags.map((flag) => [flag]),
      theme: 'striped',
      styles: { fontSize: 10 }
    })
    y = doc.lastAutoTable.finalY + 10

    // Doctor's Notes
    autoTable(doc, {
      startY: y,
      head: [["Doctor's Notes"]],
      body: [[notes || 'No notes available']],
      styles: { cellWidth: 'wrap', overflow: 'linebreak', fontSize: 10 },
      theme: 'plain'
    })

    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(10)
    doc.text(`Report ID: ${report.id} | Generated on: ${new Date().toLocaleString()}`, 14, pageHeight - 10)

    // Save file
    doc.save(`Report_${patient.fname}_${patient.lname}.pdf`)
  }

  return (
    <div className='main-body'>
      <h2 className='doctor-title'>Medical Report Summary</h2>
      <hr />

      {/* Patient Info */}
      <div className='doctor-section'>
        <h3>Patient Info</h3>
        <div className='doctor-grid'>
          <div className='doctor-label'>Name:</div>
          <div className='doctor-value'>
            {patient.fname} {patient.lname}
          </div>

          <div className='doctor-label'>Age:</div>
          <div className='doctor-value'>{age} years</div>

          <div className='doctor-label'>Sex:</div>
          <div className='doctor-value'>{patient.sex === 'M' ? 'Male' : 'Female'}</div>

          <div className='doctor-label'>Email:</div>
          <div className='doctor-value'>{patient.email}</div>

          <div className='doctor-label'>Phone:</div>
          <div className='doctor-value'>{patient.phone}</div>

          <div className='doctor-label'>Address:</div>
          <div className='doctor-value'>{patient.address}</div>

          <div className='doctor-label'>Report Created:</div>
          <div className='doctor-value'>{format(parseISO(report.createdAt), 'yyyy-MM-dd HH:mm')}</div>
        </div>
      </div>
      <hr />

      {/* Symptom Report */}
      <div className='doctor-section'>
        <h3>Symptom Check Report</h3>
        <div className='doctor-grid'>
          <div className='doctor-label'>Patient's Complaint:</div>
          <div className='doctor-value'>{diag.query}</div>

          <div className='doctor-label'>Confidence:</div>
          <div className='doctor-value'>{diag.confidence}</div>

          <div className='doctor-label'>Emergency Case:</div>
          <div className='doctor-value'>{diag.isEmergency ? 'Yes' : 'No'}</div>
        </div>
      </div>
      <hr />

      {/* Possible Conditions */}
      <div className='doctor-section'>
        <h3>Possible Conditions</h3>
        <ul>
          {diag?.response?.possible_conditions?.length > 0 ? (
            diag.response.possible_conditions.map((c, idx) => (
              <li key={idx}>
                <b>{c.name}:</b> {c.reason}
              </li>
            ))
          ) : (
            <li>No possible conditions available</li>
          )}
        </ul>
      </div>
      <hr />

      {/* Clinical Reasoning */}
      <div className='doctor-section'>
        <h3>Clinical Reasoning</h3>
        <p>{diag?.response?.reasoning}</p>
      </div>
      <hr />

      {/* Recommendations */}
      <div className='doctor-section'>
        <h3>Recommendations</h3>
        <ul className='point'>
          <li>
            <b>Immediate Actions:</b> {diag?.response?.recommendations.immediate_actions}
          </li>
          <li>
            <b>When to Seek Care:</b> {diag?.response?.recommendations.when_to_seek_care}
          </li>
          <li>
            <b>Suggested Tests:</b> {diag?.response?.recommendations.tests.join(', ')}
          </li>
        </ul>
      </div>
      <hr />

      {/* Red Flags */}
      <div className='doctor-section'>
        <h3>Red Flags</h3>
        <ul className='point'>
          {diag?.response?.red_flags.map((flag, idx) => (
            <li key={idx}>{flag}</li>
          ))}
        </ul>
      </div>
      <hr />

      {/* Reference Cases */}
      <div className='doctor-section'>
        <h3>Reference Cases</h3>
        <ul className='point'>
          {diag.cases?.map((c) => (
            <li key={c.metadata.id}>
              Patient {c.metadata.age}
              {c.metadata.gender[0].toUpperCase()} → {c.metadata.diagnosis}
            </li>
          ))}
        </ul>
      </div>
      <hr />

      {/* Doctor's Notes */}
      <div className='doctor-section'>
        <h3>Doctor's Notes</h3>
        {role === 'DOCTOR' ? (
          <>
            <textarea
              rows='4'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Enter your notes here...'
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </>
        ) : (
          <p>{notes ? notes : 'No notes available yet.'}</p>
        )}
      </div>

      {/* Actions for Doctor */}
      {role === 'DOCTOR' && (
        <div className='doctor-section'>
          <button className='btn btn-primary' onClick={handleSaveNotes} disabled={saving}>
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
          <button className='btn btn-success' onClick={handleFulfill} disabled={fulfilling}>
            {fulfilling ? 'Updating...' : 'Mark as Fulfilled'}
          </button>
        </div>
      )}

      {/* Download for everyone */}
      <div className='doctor-section'>
        {onBack && (
          <button className='btn btn-secondary' onClick={onBack} style={{ marginBottom: '20px' }}>
            Back to Reports
          </button>
        )}
        <button className='btn btn-secondary' onClick={handleDownload}>
          Download Report
        </button>
        {/* Back Button */}
      </div>
    </div>
  )
}
