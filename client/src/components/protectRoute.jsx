import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function ProtectRoute({ children }) {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access')

    if (!token) {
      navigate('/login')
    } else {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          localStorage.clear()
          navigate('/login')
        } else {
          setIsAuthorized(true) // ✅ allow rendering children
        }
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.clear()
        navigate('/login')
      }
    }
  }, [navigate])

  // Only render children if authorized
  return isAuthorized ? children : null
}

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired
}
