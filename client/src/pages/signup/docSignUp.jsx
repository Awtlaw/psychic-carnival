import './docSignUp.css'
export function DocSignUp() {
  return (
    <div className='doctor-signup-container1'>
      <a href='#' className='home-btn'>
        ← Home
      </a>

      <div class='doctor-signup-container'>
        <h2>Doctor Sign Up</h2>
        <form class='doctor-signup-form'>
          <div class='input-box'>
            <label htmlFor='firstName'>First Name</label>
            <input type='text' id='firstName' placeholder='Enter first name' required />
          </div>
          <div class='input-box'>
            <label htmlFor='lastName'>Last Name</label>
            <input type='text' id='lastName' placeholder='Enter last name' required />
          </div>
          <div class='input-box'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' placeholder='Enter email' required />
          </div>
          <div class='input-box'>
            <label htmlFor='phone'>Phone</label>
            <input type='tel' id='phone' placeholder='Enter phone number' required />
          </div>
          <div class='input-box'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' placeholder='Enter password' required />
          </div>
          <div class='input-box'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input type='password' id='confirmPassword' placeholder='Confirm password' required />
          </div>
          <button type='submit' class='btn'>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
