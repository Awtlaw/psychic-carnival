import { Link } from 'react-router-dom'
import './contact.css'
export function Contact() {
  return (
    <div className='contact-page-container'>
      <div className='contact-page'>
        <header className='hcc-header'>
          <nav className='hcc-navbar'>
            <div className='logoc'>HealthConnect</div>
            <ul className='nav-links'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/about'>About Us</Link>
              </li>
              <li>
                <Link to='/service'>Services</Link>
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
        </header>
        <section className='hc-contact'>
          <h1>Contact Us</h1>
          <p className='intro'>We’d love to hear from you! Reach out with any questions, feedback, or support needs.</p>

          <div className='hc-contact-container'>
            <div className='hc-card hc-contact-form'>
              <h2>Send Us a Message</h2>
              <form>
                <input className='hc-input' type='text' placeholder='Your Name' required />
                <input className='hc-input' type='email' placeholder='Your Email' required />
                <textarea className='hc-textarea' rows='6' placeholder='Your Message' required></textarea>
                <button className='hc-btn' type='submit'>
                  Send Message
                </button>
              </form>
            </div>

            <div className='hc-card hc-contact-info'>
              <h2>Get in Touch</h2>
              <p>
                <strong>Email:</strong> support@healthconnect.com
              </p>
              <p>
                <strong>Phone:</strong> +233 24 123 4567
              </p>
              <p>
                <strong>Address:</strong> Accra Technical University, Accra, Ghana
              </p>

              <div className='hc-social'>
                <strong>Follow Us:</strong>
                <Link to='privacy.html'>Facebook</Link>
                <Link to='privacy.html'>Twitter/X</Link>
                <Link to='privacy.html'>LinkedIn</Link>
              </div>
            </div>
          </div>
        </section>
        <footer className='hcc-footer'>
          <p>© 2025 HealthConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
