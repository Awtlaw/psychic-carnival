import { useState } from 'react'
import { format } from 'date-fns'
import { signupPatient } from '../../apis'
import './patientSignUp.css'
export function PatientSignUp() {
  const init = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    sex: 'M',
    address: '',
    proxy: null
  }
  const [patientForm, setPatientForm] = useState(init)

  const handleChange = (e) => {
    const { name, value } = e.target
    setPatientForm({ ...patientForm, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res
    try {
      res = await signupPatient({ ...patientForm, dob: format(patientForm.dob, 'MM/dd/yyyy') })
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
    <div className='signup-container'>
      <a href='#' className='home-btn'>
        ← Home
      </a>
      <div className='signup-box'>
        <img src='logo.png' alt='' />
        <h2>Create Your HealthConnect Account</h2>
        <form className='signup-form' onSubmit={handleSubmit}>
          <div className='input-box'>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              placeholder='Enter your first name'
              required
              name='firstName'
              value={patientForm.firstName}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              placeholder='Enter your last name'
              required
              name='lastName'
              value={patientForm.lastName}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              placeholder='Enter your email'
              required
              name='email'
              value={patientForm.email}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='phone'>Phone</label>
            <input
              type='tel'
              id='phone'
              placeholder='Enter your phone number'
              required
              name='phone'
              value={patientForm.phone}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              placeholder='Create a password'
              required
              name='password'
              value={patientForm.password}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='Re-enter your password'
              required
              name='confirmPassword'
              value={patientForm.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className='input-box'>
            <label htmlFor='dob'>Date of Birth</label>
            <input type='date' id='dob' required name='dob' value={patientForm.dob} onChange={handleChange} />
          </div>
          <div className='input-box'>
            <label htmlFor='sex'>Sex</label>
            <select id='sex' required name='sex' value={patientForm.sex} onChange={handleChange}>
              <option value='' disabled selected>
                Select sex
              </option>
              <option value='M'>Male</option>
              <option value='F'>Female</option>
            </select>
          </div>
          <div className='input-box full-width'>
            <label htmlFor='address'>Address</label>
            <textarea
              id='address'
              placeholder='Enter your address'
              required
              name='address'
              value={patientForm.address}
              onChange={handleChange}
            ></textarea>
          </div>
          <button className='signup-bnt' type='submit'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
