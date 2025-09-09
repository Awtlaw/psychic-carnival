import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { getDoctorById } from '../apis'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/logo.png'

export function Dnavbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { sub: userId } = jwtDecode(localStorage.getItem('access'))
        const res = await getDoctorById(userId)
        setUser(res.data)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }
    fetchUser()
  }, [])
  return (
    <div className='baseline'>
      <nav style={{ borderBottom: '1px solid #F2F2F2' }}>
        <div className='navbar'>
          {/* Left side */}
          <div className='nlogo'>
            <div className='logoN'>
              <img src={logo} alt='logo' />
            </div>
            <div>
              <Link to='/' className='logo'>
                HealthConnect
              </Link>
            </div>
          </div>
          {/* Right side (User name plus doc avatar) */}
          <div className='nav-user'>
            <span className='username'>{user ? `Dr. ${user.fname} ${user.lname}` : 'Loading...'}</span>

            <span className='doctor-icon'>{user ? (user.sex === 'M' ? '👨‍⚕️' : user.sex === 'F' ? '👩‍⚕️' : '🧑‍⚕️') : '❓'}</span>
            {/* <img src='doctor.png' alt='profile' className='profile-pic' />       Placeholder for doctor profile picture */}
          </div>
        </div>
      </nav>
    </div>
  )
}
