import { FaRobot, FaBullhorn } from 'react-icons/fa'
import './Sidebar.css' // Assuming you have a CSS file for styling
import { useState } from 'react'

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(false)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode', !darkMode)
  }
  return (
    <div className='sidebar'>
      <div className='opts-wrapper'>
        <ul className='sidebar-menu'>
          <li>
            <a href='#'>
              <FaRobot className='icon' />
              Clinical AI
            </a>
          </li>
        </ul>

        <div className='dark-mode-toggle'>
          <input type='checkbox' id='darkModeToggle' checked={darkMode} onChange={toggleDarkMode} />
          <label htmlFor='darkModeToggle'>Dark Mode</label>
        </div>
      </div>
      <div>
        <hr />

        <a href='#' className='feedback-link'>
          <FaBullhorn className='icon' />
          Submit Feedback
        </a>
      </div>
    </div>
  )
}
