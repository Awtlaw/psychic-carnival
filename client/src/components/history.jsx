import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faFile, faUserDoctor, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './history.css'

export function History() {
  return (
    <div className='history-main-container'>
      <div className='search-container'>
        <h2>Patient's Search</h2>
        <div className='search-box'>
          <input type='text' placeholder='Patient Name' />
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>

      <div>
        <div className='section-title'>History</div>

        <div className='history-form'>
          <div className='history-row'>
            <label>
              <FontAwesomeIcon icon={faFile} /> Title:
            </label>
            <span>
              <a href='#'>Report for John Doe</a>
            </span>
          </div>
          <div className='history-row'>
            <label>
              <FontAwesomeIcon icon={faUserDoctor} /> Created By:
            </label>
            <span>Dr. Smith</span>
          </div>
          <div className='history-row'>
            <label>
              <FontAwesomeIcon icon={faClock} /> Timestamp:
            </label>
            <span>2025-08-18 10:30 AM</span>
          </div>
        </div>

        <div className='history-form'>
          <div className='history-row'>
            <label>Status:</label>
            <span>No record found</span>
          </div>
        </div>
      </div>
    </div>
  )
}
