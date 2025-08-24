import { useParams } from 'react-router-dom'
import './summary.css'
import { useEffect, useState } from 'react'
import { getOneReport, getPatientById } from '../apis'
import { parseISO, format, differenceInYears } from 'date-fns'

export function Summary() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [patient, setPatient] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data } = await getOneReport(id)
      data.diagnosis = JSON.parse(data.diagnosis)
      setReport(data)

      // fetch patient details
      const patientRes = await getPatientById(data.patientId)
      setPatient(patientRes.data)
    }
    fetchData()
  }, [id])

  if (!report || !patient) return <p>Loading...</p>

  const diag = report.diagnosis
  const age = differenceInYears(new Date(), new Date(patient.dob))

  return (
    <div className='doctor-container'>
      <h2 className='doctor-title'>Doctor’s View</h2>
      <hr />
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
      <hr />

      {/* Symptom Report */}
      <div className='doctor-section'>
        <h3>Symptom Check Report</h3>
        <div className='doctor-grid'>
          <div className='doctor-label'>Patient’s Complaint:</div>
          <div className='doctor-value'>{diag.query}</div>

          <div className='doctor-label'>Confidence:</div>
          <div className='doctor-value'>{diag.confidence}</div>

          <div className='doctor-label'>Emergency Case:</div>
          <div className='doctor-value'>{diag.isEmergency ? 'Yes' : 'No'}</div>
        </div>
      </div>
      <hr />
      <hr />

      {/* Possible Conditions */}
      <div className='doctor-section'>
        <h3>Possible Conditions</h3>
        <ul className='point'>
          {diag.response.possible_conditions.map((c, idx) => (
            <li key={idx}>
              <b>{c.name}:</b> – {c.reason}
            </li>
          ))}
        </ul>
      </div>
      <hr />
      <hr />

      {/* Clinical Reasoning */}
      <div className='doctor-section'>
        <h3>Clinical Reasoning</h3>
        <p>{diag.response.reasoning}</p>
      </div>
      <hr />
      <hr />

      {/* Recommendations */}
      <div className='doctor-section'>
        <h3>Recommendations</h3>
        <ul className='point'>
          <li>
            <b>Immediate Actions:</b> {diag.response.recommendations.immediate_actions}
          </li>
          <li>
            <b>When to Seek Care:</b> {diag.response.recommendations.when_to_seek_care}
          </li>
          <li>
            <b>Suggested Tests:</b> {diag.response.recommendations.tests.join(', ')}
          </li>
        </ul>
      </div>
      <hr />
      <hr />

      {/* Red Flags */}
      <div className='doctor-section'>
        <h3>Red Flags</h3>
        <ul className='point'>
          {diag.response.red_flags.map((flag, idx) => (
            <li key={idx}>{flag}</li>
          ))}
        </ul>
      </div>
      <hr />
      <hr />

      {/* Reference Cases */}
      <div className='doctor-section'>
        <h3>Reference Cases</h3>
        <ul className='point'>
          {diag.cases.map((c) => (
            <li key={c.metadata.id}>
              Patient {c.metadata.age}
              {c.metadata.gender[0].toUpperCase()} → {c.metadata.diagnosis}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
