import './patientSignUp.css'
export function PatientSignUp() {
  return (
    <div className='signup-container'>
      <a href='#' className='home-btn'>
        ← Home
      </a>
      <div className='signup-box'>
        <h2>Create Your HealthConnect Account</h2>
        <form className='signup-form'>
          <div className='input-box'>
            <label htmlFor='firstName'>First Name</label>
            <input type='text' id='firstName' placeholder='Enter your first name' required />
          </div>
          <div className='input-box'>
            <label htmlFor='lastName'>Last Name</label>
            <input type='text' id='lastName' placeholder='Enter your last name' required />
          </div>
          <div className='input-box'>
            <label htmlFor='email'>Email Address</label>
            <input type='email' id='email' placeholder='Enter your email' required />
          </div>
          <div className='input-box'>
            <label htmlFor='phone'>Phone</label>
            <input type='tel' id='phone' placeholder='Enter your phone number' required />
          </div>
          <div className='input-box'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' placeholder='Create a password' required />
          </div>
          <div className='input-box'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input type='password' id='confirmPassword' placeholder='Re-enter your password' required />
          </div>
          <div className='input-box'>
            <label htmlFor='dob'>Date of Birth</label>
            <input type='date' id='dob' required />
          </div>
          <div className='input-box'>
            <label htmlFor='sex'>Sex</label>
            <select id='sex' required>
              <option value='' disabled selected>
                Select sex
              </option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div className='input-box full-width'>
            <label htmlFor='address'>Address</label>
            <textarea id='address' placeholder='Enter your address' required></textarea>
          </div>
          <button className='signup-bnt' type='submit'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
