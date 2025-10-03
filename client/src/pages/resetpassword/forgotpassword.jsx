// // src/pages/ForgotPassword.jsx
// import { useState } from 'react'
// import { forgotPassword } from '../../apis/pass.js'
// import './password.css'

// export function ForgotPassword() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const res = await forgotPassword(email)
//     setMessage(res.message)
//   }

//   return (
//     <div className='password-container'>
//       <div className='auth-container'>
//         <h2>Forgot Password</h2>
//         <form onSubmit={handleSubmit} className='auth-form'>
//           <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
//           <button type='submit'>Send Reset Link</button>
//         </form>
//         {message && <p className='message'>{message}</p>}
//       </div>
//     </div>
//   )
// }

// src/pages/ForgotPassword.jsx
import { useState } from 'react'
import axios from 'axios'
import './password.css'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('patient') // default role
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`http://localhost:3000/api/user/${role}/forgot-password`, { email })
      setMessage(res.data.message)
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className='password-container'>
      <div className='auth-container'>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className='auth-form'>
          <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value='admin'>Admin</option>
            <option value='doctor'>Doctor</option>
            <option value='patient'>Patient</option>
          </select>
          <button type='submit'>Send Reset Link</button>
        </form>
        {message && <p className='message'>{message}</p>}
      </div>
    </div>
  )
}
