import { useState } from 'react'
import './Navbar.css' // Assuming you have a CSS file for stylingimport { useState } from 'react'

export function Navbar() {
  const [toggleHamburger, setToggleHamburger] = useState(false)

  const handleToggle = () => {
    setToggleHamburger(!toggleHamburger)
  }
  return (
    <div className='baseline'>
      <nav style={{ borderBottom: '1px solid #F2F2F2' }}>
        <div className='navbar'>
          <div className='nlogo'>
            <div className='logoN'>
              <img src='logo.png' alt='logo' />
            </div>
            <div>
              <a href='#' className='logo'>
                HealthConnect
              </a>
            </div>
          </div>

          <div className='menu-btn' id='menu-btn' onClick={handleToggle}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-links ${toggleHamburger ? 'show' : ''}`}>
            <a href='#'>Home</a>
            <a href='#'>About</a>
            <a href='#'>Services</a>
            <a href='#'>Contact</a>
          </div>
        </div>
      </nav>
    </div>
  )
}
