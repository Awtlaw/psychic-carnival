import { useState } from 'react'
import { loginUser } from '../../apis'
import './login.css'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const init = {
    username: '',
    password: ''
  }

  const [form, setForm] = useState(init)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    let res
    try {
      res = await loginUser(form)
      if (res.message === 'success') {
        alert(res.message)
        localStorage.clear()
        localStorage.setItem('access', res.accessToken)
        const userObject = jwtDecode(localStorage.getItem('access'))

        switch (userObject.role) {
          case 'DOCTOR':
            navigate('/reports')
            break
          case 'PATIENT':
            navigate('/home')
            break
          case 'ADMIN':
            navigate('/admin')
            break
        }
      } else {
        alert(res.message)
      }
    } catch (e) {
      console.err(e)
      alert(e)
    }
  }

  return (
    <div className='login-container'>
      <Link to='/' className='home-btn'>
        ← Home
      </Link>
      <div className='login-box'>
        <img src='logo.png' alt='HealthConnect Logo' />
        <h2>Welcome Back to HealthConnect</h2>
        <form className='login-form' onSubmit={handleLogin}>
          <div className='login-input-box'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              required
              name='username'
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className='login-input-box'>
            <label htmlFor='password' placeholder='P@ssw0rd@'>
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='Enter your password'
              required
              name='password'
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className='options'>
            <label>
              <input type='checkbox' /> Remember me
            </label>
            <Link to='/forgot-password'>Forgot Password?</Link>
          </div>
          <button type='submit' className=' log-btn'>
            Login
          </button>
          <div className='signup'>
            <p>
              Don't have an account? <Link to='/register-patient'>Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Logout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/', { replace: true })
  }

  return (
    <button type='button' className='logout-btn' onClick={handleLogout}>
      Logout
    </button>
  )
}
