import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { getPatientById } from '../apis'
import './Navbar.css'

export function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { sub: userId } = jwtDecode(localStorage.getItem('access'))
        const res = await getPatientById(userId)
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
              <img src='logo.png' alt='logo' />
            </div>
            <div>
              <Link to='/' className='logo'>
                HealthConnect
              </Link>
            </div>
          </div>

          {/* Right side (User info only) */}
          <div className='nav-user'>
            <span className='username'>{user ? `${user.fname} ${user.lname}` : 'Loading...'}</span>
            <img src={user?.pfpUrl || `http://localhost:5173/api/upload/image/${user?.id}`} alt='profile' className='profile-pic' />
          </div>
        </div>
      </nav>
    </div>
  )
}
