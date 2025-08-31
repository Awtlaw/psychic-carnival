import { Link } from 'react-router-dom'
import './contact.css'
export function Dcontact() {
  return (
    <div className='contact-page-container'>
      <div className='contact-page'>
        <header className='hcc-header'>
          <nav className='hcc-navbar'>
            <div className='logoc'>HealthConnect</div>
            <ul className='nav-links'>
              <li>
                <Link to='/reports'>Home</Link>
              </li>
              <li>
                <Link to='/dabout'>About</Link>
              </li>
              <li>
                <Link to='/dservices'>Services</Link>
              </li>
              <li>
                <Link to='/dcontact' className='active'>
                  Contact
                </Link>
              </li>
            </ul>
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
                <Link to='#'>Facebook</Link>
                <Link to='#'>Twitter/X</Link>
                <Link to='#'>LinkedIn</Link>
              </div>
            </div>
          </div>
        </section>
        <footer className='hcc-footer'>
          <div className='hcc-footer-inner'>
            <p>© 2025 HealthConnect. All rights reserved.</p>
            <div className='footer-links'>
              <Link to='privacy.html'>Privacy</Link>
              <Link to='terms.html'>Terms</Link>
              <Link to='#top'>Back to top</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
