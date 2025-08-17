import './login.css'
export function Login() {
  return (
    <div className='login-container'>
      <a href='index.html' className='home-btn'>
        ← Home
      </a>
      <div className='login-box'>
        <img src='/html/images/image-removebg-preview (2).png' alt='HealthConnect Logo' />
        <h2>Welcome Back to HealthConnect</h2>
        <form className='login-form'>
          <div className='login-input-box'>
            <label htmlFor='email'>Email Address</label>
            <input type='email' id='email' placeholder='Enter your email' required />
          </div>
          <div className='login-input-box'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' placeholder='Enter your password' required />
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
