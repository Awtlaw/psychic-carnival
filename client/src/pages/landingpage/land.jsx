import { Link } from 'react-router-dom'
import './land.css'

export function Land() {
  return (
    <div className='hcl-landing'>
      <div className='hc-main-landing-container'>
        <nav className='hcl-nav'>
          <div className='hcl-brand'>HealthConnect</div>
          <ul className='hcl-nav-links'>
            <li>
              <Link to='/home'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About Us</Link>
            </li>
            <li>
              <Link to='/service'>Service</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
          <div>
            <Link to='/login' className='hcl-btn hcl-btn-outline'>
              Login
            </Link>
            <Link to='/register-patient' className='hcl-btn hcl-btn-custom'>
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero  */}
        <section className='hcl-hero'>
          <h1>Introducing HealthConnect</h1>
          <p>
            In an increasingly complex and data-driven world, our AI solutions empower medical professionals, patients, and healthcare
            organizations to make informed decisions, improve patient outcomes, and enhance healthcare experiences.
          </p>
          <Link to='/' className='hcl-btn hcl-btn-custom'>
            Explore Dashboard →
          </Link>
          <div>
            <img src='doc.png' alt='Health Dashboard' />
          </div>
        </section>

        {/* Features  */}
        <section className='hcl-features'>
          <div className='hcl-feature-card'>
            <h3>Clinical Reporting</h3>
            <p>Streamline your healthcare journey with accurate reports and diagnosis, enabling personalized treatment plans.</p>
            <Link to='/' className='hcl-btn hcl-btn-custom'>
              Learn More
            </Link>
          </div>
          <div className='hcl-feature-card'>
            <h3>Symptom Checker</h3>
            <p>Quickly identify potential health issues and make informed decisions about your well-being.</p>
            <Link to='/' className='hcl-btn hcl-btn-custom'>
              Learn More
            </Link>
          </div>
          <div className='hcl-feature-card'>
            <h3>Appointments</h3>
            <p>Simplify scheduling with our convenient appointment booking feature.</p>
            <Link to='/' className='hcl-btn hcl-btn-custom'>
              Learn More
            </Link>
          </div>
        </section>

        {/* Signup CTA  */}
        <section className='hcl-signup'>
          <h2>Get Started with HealthConnect</h2>
          <p>Sign up today and take control of your healthcare journey.</p>
          <form>
            <input type='email' placeholder='Email Address' required />
            <input type='password' placeholder='Password' required />
            <button type='submit' className='hcl-btn hcl-btn-custom'>
              Sign Up
            </button>
          </form>
        </section>

        {/* Footer  */}
        <footer className='hcl-footer'>
          <p>© 2025 HealthConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
