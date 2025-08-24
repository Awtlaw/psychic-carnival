import { faClock, faFile, faUserDoctor } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'
import { useEffect, useState } from 'react'
import { listReports, getPatientById } from '../apis'

export function History() {
  const [reportsList, setReportsList] = useState([])
  const [patients, setPatients] = useState({}) // store patient info keyed by id

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await listReports()
        if (res?.data) {
          setReportsList(res.data)

          // fetch all patient info in parallel
          const patientPromises = res.data.map((report) => getPatientById(report.patientId))
          const patientsData = await Promise.all(patientPromises)

          // store patients keyed by id for easy lookup
          const patientsMap = {}
          patientsData.forEach((p) => {
            patientsMap[p.id] = p
          })
          setPatients(patientsMap)
        }
      } catch (err) {
        console.error('Failed to load reports or patients:', err)
      }
    }

    fetchReports()
  }, [])

  return (
    <div className='doctor-container1'>
      <h2 className='doctor-title1'>Symptom Checker Reports</h2>
      <hr />
      <hr />

      {reportsList.length > 0 ? (
        reportsList.map((report) => {
          const patient = patients[report.patientId]

          return (
            <div className='doctor-section1' key={report.id}>
              <h3>Report Summary</h3>
              <div className='doctor-grid1'>
                {/* Title */}
                <div className='doctor-label1'>
                  <FontAwesomeIcon icon={faFile} /> Title:
                </div>
                <div className='doctor-value1'>
                  <a href='#'>
                    Report #{report.id} – Patient {patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...'}
                  </a>
                </div>

                {/* Created By */}
                <div className='doctor-label1'>
                  <FontAwesomeIcon icon={faUserDoctor} /> Created By:
                </div>
                <div className='doctor-value1'>{report.doctorId ? `Dr. ${report.doctorId}` : 'System Generated'}</div>

                {/* Timestamp */}
                <div className='doctor-label1'>
                  <FontAwesomeIcon icon={faClock} /> Timestamp:
                </div>
                <div className='doctor-value1'>{new Date(report.createdAt).toLocaleString()}</div>
              </div>
              <hr />
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
