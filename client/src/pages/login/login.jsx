import { useState } from 'react'
import { loginUser } from '../../apis'
import './login.css'
export function Login() {
  const init = {
    username: '',
    password: ''
  }

  const [form, setForm] = useState(init)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    let res
    try {
      res = await loginUser(form)
      if (res.success) {
        alert(res.message)
      } else {
        alert(res.message)
      }
    } catch {
      alert(res.message)
    }
  }

  return (
    <div className='login-container'>
      <a href='index.html' className='home-btn'>
        ← Home
      </a>
      <div className='login-box'>
        <img src='/html/images/image-removebg-preview (2).png' alt='HealthConnect Logo' />
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
