import { Link } from 'react-router-dom'
import './Page.css'

export default function PageNotFound() {
  return (
    <div className='page-not-found'>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to='/home' className='page-not-found-link'>
        Go to Homepage
      </Link>
    </div>
  )
}
