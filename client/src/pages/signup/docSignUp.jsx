import { signupDoctor } from '../../apis'
import { useState } from 'react'
import './docSignUp.css'

export function DocSignUp() {
  const init = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }

  const [docForm, setDocForm] = useState(init)
  const [createdDoctor, setCreatedDoctor] = useState(null)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('') // ✅ track copied field

  const handleChange = (e) => {
    const { name, value } = e.target
    setDocForm({ ...docForm, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const validateForm = () => {
    let newErrors = {}
    if (!docForm.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!docForm.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!/\S+@\S+\.\S+/.test(docForm.email)) newErrors.email = 'Valid email required'
    if (!/^\d{10,15}$/.test(docForm.phone)) newErrors.phone = 'Valid phone number required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function generateTempPassword(length = 10) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const special = '!@#$%^&*()_+[]{}|;:,.<>?'

    // Make sure at least one of each is included
    const all = upper + lower + numbers + special
    let password =
      upper[Math.floor(Math.random() * upper.length)] +
      lower[Math.floor(Math.random() * lower.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      special[Math.floor(Math.random() * special.length)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }

    // Shuffle so it's not predictable
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const tempPassword = generateTempPassword()

    setLoading(true)

    try {
      const res = await signupDoctor({ ...docForm, password: tempPassword })
      if (res.success) {
        setCreatedDoctor({
          name: `${docForm.firstName} ${docForm.lastName}`,
          email: docForm.email
        })
        setGeneratedPassword(tempPassword)
        setDocForm(init) // ✅ reset form
      } else {
        console.log(res)
        setErrors({ general: res.message })
      }
    } catch (err) {
      console.error('Onboard error:', err)
      setErrors({ general: 'Failed to register doctor. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // ✅ handle copy action
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000) // reset after 2s
  }

  return (
    <div className='doctor-signup-container1'>
      <div className='doctor-signup-container'>
        <h2>Onboard Doctor</h2>

        {errors.general && <p className='error-message'>{errors.general}</p>}

        {createdDoctor && (
          <div className='success-message'>
            <p>
              Doctor <strong>{createdDoctor.name}</strong> created successfully!
            </p>

            <p>
              <strong>Email:</strong> {createdDoctor.email}{' '}
              <button type='button' className='copy-btn' onClick={() => handleCopy(createdDoctor.email, 'email')}>
                {copied === 'email' ? 'Copied!' : 'Copy'}
              </button>
            </p>

            <p>
              <strong>Temporary Password:</strong> {generatedPassword}{' '}
              <button type='button' className='copy-btn' onClick={() => handleCopy(generatedPassword, 'password')}>
                {copied === 'password' ? 'Copied!' : 'Copy'}
              </button>
            </p>
          </div>
        )}

        <form className='doctor-signup-form' onSubmit={handleSubmit}>
          <div className='input-box'>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              placeholder='Enter first name'
              value={docForm.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
          </div>

          <div className='input-box'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              placeholder='Enter last name'
              value={docForm.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span className='error-message'>{errors.lastName}</span>}
          </div>

          <div className='input-box'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' placeholder='Enter email' value={docForm.email} onChange={handleChange} />
            {errors.email && <span className='error-message'>{errors.email}</span>}
          </div>

          <div className='input-box'>
            <label htmlFor='phone'>Phone</label>
            <input type='tel' id='phone' name='phone' placeholder='Enter phone number' value={docForm.phone} onChange={handleChange} />
            {errors.phone && <span className='error-message'>{errors.phone}</span>}
          </div>

          <button type='submit' className='btn' disabled={loading}>
            {loading ? 'Creating...' : 'Create Doctor'}
          </button>
        </form>
      </div>
    </div>
  )
}
