import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'

export function ProtectRoute({ children }) {
  const token = localStorage.getItem('access')

  if (!token) {
    return <Navigate to='/' replace />
  }

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem('access')
      return <Navigate to='/' replace />
    }

    return children
  } catch (error) {
    // Invalid token
    console.error('Invalid token:', error)
    localStorage.removeItem('access')
    return <Navigate to='/' replace />
  }
}

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired
}
