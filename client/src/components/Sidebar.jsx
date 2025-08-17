import { FaRobot, FaBullhorn } from 'react-icons/fa'
import './Sidebar.css' // Assuming you have a CSS file for styling
export function Sidebar() {
  return (
    <div className='sidebar'>
      <div className='layout'>
        <div className='top'>name</div>
        <div className='middle'>
          <input type='checkbox' name='dark-mode' id='dark-mode' />
          <label htmlFor='dark-mode'>Dark Mode</label>
        </div>
      </div>
      <div className='button'>feedback</div>
    </div>
  )
}
