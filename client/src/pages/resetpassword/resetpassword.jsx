import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './password.css'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const role = searchParams.get('role') || 'patient' // pass role in reset link
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/${role}/reset-password`, {
        token,
        password
      })
      setMessage(res.data.message)
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className='password-container'>
      <div className='auth-container'>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className='auth-form'>
          <input type='password' placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type='submit'>Reset Password</button>
        </form>
        {message && <p className='message'>{message}</p>}
      </div>
    </div>
  )
}
