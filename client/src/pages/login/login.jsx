import { useState } from 'react'
import { loginUser } from '../../apis'
import './login.css'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

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
      <a href='index.html' className='home-btn'>
        ← Home
      </a>
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
            <label htmlFor='password'>Password</label>
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
            <a href='#'>Forgot Password?</a>
          </div>
          <button type='submit' className=' log-btn'>
            Login
          </button>
          <div className='signup'>
            <p>
              Don't have an account? <a href='signup.html'>Sign up</a>
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
    navigate('/login', { replace: true })
  }
  return (
    <button type='button' onClick={handleLogout}>
      <div className=''>Logout</div>
    </button>
  )
}
