import { faClock, faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'
import { useEffect, useState } from 'react'
import { listReports, getPatientById } from '../apis'
import { parseISO, format } from 'date-fns'
import { Link } from 'react-router-dom'

export function History() {
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({})

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await listReports()
        setReportsList(res.data)
      } catch (err) {
        console.error('Failed to load reports:', err)
      }
    }
    fetchReports()
  }, [])

  // Fetch patients for reports
  useEffect(() => {
    if (reportsList.length === 0) return

    const fetchPatients = async () => {
      try {
        const uniqueIds = [...new Set(reportsList.map((r) => r.patientId))]
        const entries = await Promise.all(
          uniqueIds.map(async (id) => {
            const patient = await getPatientById(id)
            return [id, patient.data]
          })
        )
        setPatients(Object.fromEntries(entries))
      } catch (err) {
        console.error('Failed to load patients:', err)
      }
    }
    fetchPatients()
  }, [reportsList])

  return (
    <div className='history-container'>
      <h2 className='history-title'>📝 Symptom Checker Reports</h2>
      <hr className='bar' />
      <hr className='bar' />

      {reportsList.length > 0 ? (
        <div className='reports-list'>
          {reportsList.map((r) => {
            const patient = patients[r.patientId]
            return (
              <div className='report-card' key={r.id}>
                <div className='report-info'>
                  <FontAwesomeIcon icon={faFile} className='report-icon' />
                  <Link to={`${r.id}`} className='report-link'>
                    {patient ? `Report for ${patient.fname} ${patient.lname}` : 'Loading patient...'}
                  </Link>
                </div>
                <div className='report-time'>
                  <FontAwesomeIcon icon={faClock} className='time-icon' />
                  <span>{format(parseISO(r.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='no-records'>
          <h3>No Reports Found</h3>
          <p>Patient reports will appear here once available.</p>
        </div>
      )}
    </div>
  )
}
