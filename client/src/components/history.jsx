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
      const entries = await Promise.all(
        reportsList.map(async (r) => {
          const patient = await getPatientById(r.patientId)
          return [r.patientId, patient.data]
        })
      )
      setPatients(Object.fromEntries(entries))
    }

    if (reportsList.length > 0) {
      fetchPatients()
    }
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
                <Link to=''>{patient ? `Report for ${patient.fname} ${patient.lname}` : 'Loading...'}</Link>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faClock} />
                <div>{format(parseISO(`${r.createdAt}`), 'MM-dd-yyyy k:mm')}</div>
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

      {/* {reportsList.length > 0 ? ( */}
      {/*   reportsList.map((report) => { */}
      {/*     const patient = patients[report.patientId] */}
      {/**/}
      {/*     return ( */}
      {/*       <div className='doctor-section1' key={report.id}> */}
      {/*         <div className='doctor-grid1'> */}
      {/*           {/* Title */}
      {/*           <div className='doctor-label1'> */}
      {/*             <FontAwesomeIcon icon={faFile} /> Title: */}
      {/*           </div> */}
      {/*           <div className='doctor-value1'> */}
      {/*             <a href='#'> */}
      {/*               Report #{report.id} – Patient {patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...'} */}
      {/*             </a> */}
      {/*           </div> */}
      {/**/}
      {/*           {/* Timestamp */}
      {/*           <div className='doctor-label1'> */}
      {/*             <FontAwesomeIcon icon={faClock} /> Timestamp: */}
      {/*           </div> */}
      {/*           <div className='doctor-value1'>{new Date(report.createdAt).toLocaleString()}</div> */}
      {/*         </div> */}
      {/*         <hr /> */}
      {/*       </div> */}
      {/*     ) */}
      {/*   }) */}
      {/* ) : ( */}
      {/*   <div className='doctor-section1'> */}
      {/*     <h3>Status</h3> */}
      {/*     <p className='record'>No record found</p> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  )
}
