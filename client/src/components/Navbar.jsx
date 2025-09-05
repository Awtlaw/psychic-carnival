import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css' // Assuming you have a CSS file for stylingimport { useState } from 'react'
import { Logout } from '../pages/login/login'

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
              <Link to='/' className='logo'>
                HealthConnect
              </Link>
            </div>
          </div>

          <div className='menu-btn' id='menu-btn' onClick={handleToggle}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-links ${toggleHamburger ? 'show' : ''}`}>
            <Link to='/reports'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/service'>Services</Link>
            <Link to='/contact'>Contact</Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
