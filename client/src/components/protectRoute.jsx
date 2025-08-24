import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export function ProtectRoute({ children }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('access')

  if (!token) {
    navigate('/login')
  }

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem('access')
      navigate('/login')
    }

    return children
  } catch (error) {
    console.log('Invalid token:', error)
    localStorage.clear()
    navigate('/login')
  }
}

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired
}
