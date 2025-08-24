import { signupDoctor } from '../../apis'
import { useState } from 'react'
import './docSignUp.css'
export function DocSignUp() {
  const init = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  }
  const [docForm, setDocForm] = useState(init)

  const handleChange = (e) => {
    const { name, value } = e.target
    setDocForm({ ...docForm, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res
    try {
      res = await signupDoctor(docForm)
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
    <div className='doctor-signup-container1'>
      <a href='#' className='home-btn'>
        ← Home
      </a>

      <div class='doctor-signup-container'>
        <img src='logo.png' alt='logo' />
        <h2>Doctor Sign Up</h2>
        <form class='doctor-signup-form' onSubmit={handleSubmit}>
          <div class='input-box'>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              placeholder='Enter first name'
              required
              name='firstName'
              value={docForm.firstName}
              onChange={handleChange}
            />
          </div>
          <div class='input-box'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              placeholder='Enter last name'
              required
              name='lastName'
              value={docForm.lastName}
              onChange={handleChange}
            />
          </div>
          <div class='input-box'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' placeholder='Enter email' required name='email' value={docForm.email} onChange={handleChange} />
          </div>
          <div class='input-box'>
            <label htmlFor='phone'>Phone</label>
            <input
              type='tel'
              id='phone'
              placeholder='Enter phone number'
              required
              name='phone'
              value={docForm.phone}
              onChange={handleChange}
            />
          </div>
          <div class='input-box'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              placeholder='Enter password'
              required
              name='password'
              value={docForm.password}
              onChange={handleChange}
            />
          </div>
          <div class='input-box'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='Confirm password'
              required
              name='confirmPassword'
              value={docForm.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type='submit' class='btn'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
