import { useState } from 'react'
import './Navbar.css' // Assuming you have a CSS file for stylingimport { useState } from 'react'

export function Navbar() {
  const [toggleHamburger, setToggleHamburger] = useState(false)

  const handleToggle = () => {
    setToggleHamburger(!toggleHamburger)
  }
  return (
    <div className='baseline'>
      <nav>
        <div className='navbar'>
          <a href='#' className='logo'>
            HealthConnect
          </a>

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
