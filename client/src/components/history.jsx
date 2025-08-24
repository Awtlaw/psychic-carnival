import { faClock, faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'
import { useEffect, useState } from 'react'
import { listReports, getPatientById } from '../apis'
import { parseISO, format } from 'date-fns'
import { Link } from 'react-router-dom'

export function History() {
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({}) // store patient info keyed by id

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await listReports()
        setReportsList(res.data)
      } catch (err) {
        console.error('Failed to load reports or patients:', err)
      }
    }

    fetchReports()
  }, [])

  useEffect(() => {
    const fetchPatients = async () => {
      const uniqueIds = [...new Set(reportsList.map((r) => r.patientId))]
      const entries = await Promise.all(
        uniqueIds.map(async (id) => {
          const patient = await getPatientById(id)
          return [id, patient.data]
        })
      )
      setPatients(Object.fromEntries(entries))
    }

    fetchPatients()
  }, [reportsList])

  console.log(reportsList)
  return (
    <div className='doctor-container1'>
      <h2 className='doctor-title1'>Symptom Checker Reports List</h2>
      <hr />
      <hr />

      {reportsList.length > 0 ? (
        reportsList.map((r) => {
          const patient = patients[r.patientId]
          return (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faFile} />
                <Link to={`${r.id}`}>{patient ? `Report for ${patient.fname} ${patient.lname}` : 'Loading...'}</Link>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClock} />
                <div>{format(parseISO(r.createdAt), 'MM-dd-yyyy k:mm')}</div>
              </div>
            </div>
          )
        })
      ) : (
        <div className='doctor-section1'>
          <h3>Status</h3>
          <p className='record'>No record found</p>
        </div>
      )}
    </div>
  )
}
