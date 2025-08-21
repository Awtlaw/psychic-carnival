import './contact.css'
export function Contact() {
  return (
    <div className='contact-page'>
      <header className='hcc-header'>
        <nav className='hcc-navbar'>
          <div className='logoc'>HealthConnect</div>
          <ul className='nav-links'>
            <li>
              <a href='index.html'>Home</a>
            </li>
            <li>
              <a href='about.html'>About</a>
            </li>
            <li>
              <a href='services.html'>Services</a>
            </li>
            <li>
              <a href='contact.html' className='active'>
                Contact
              </a>
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
              <a href='#'>Facebook</a>
              <a href='#'>Twitter/X</a>
              <a href='#'>LinkedIn</a>
            </div>
          </div>
        </div>
      </section>
      <footer className='hcc-footer'>
        <div className='hcc-footer-inner'>
          <p>© 2025 HealthConnect. All rights reserved.</p>
          <div className='footer-links'>
            <a href='privacy.html'>Privacy</a>
            <a href='terms.html'>Terms</a>
            <a href='#top'>Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
