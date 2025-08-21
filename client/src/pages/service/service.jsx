import './service.css'
export function Service() {
  return (
    <div className='service-page'>
      <header className='hc-header'>
        <nav className='hc-navbar'>
          <div className='logo1'>HealthConnect</div>
          <ul className='nav-links'>
            <li>
              <a href='index.html'>Home</a>
            </li>
            <li>
              <a href='about.html'>About</a>
            </li>
            <li>
              <a href='services.html' className='active'>
                Services
              </a>
            </li>
            <li>
              <a href='contact.html'>Contact</a>
            </li>
          </ul>
        </nav>
      </header>
      <section className='hc-services-hero'>
        <h1>Our Services</h1>
        <p>Explore the healthcare solutions we provide to make your journey easier and smarter.</p>
      </section>

      <section className='hc-services-list'>
        <div className='service-card'>
          <img src='images/symptom-checker.jpg' alt='Symptom Checker' />
          <h2>AI Symptom Checker</h2>
          <p>Get instant insights about your symptoms using our AI-powered tool designed to support accurate diagnosis.</p>
        </div>

        <div className='service-card'>
          <img src='' alt='Doctor Appointment' />
          <h2>Doctor Appointment Booking</h2>
          <p>Book an appointment with qualified doctors at nearby hospitals and clinics with just a few clicks.</p>
        </div>

        <div className='service-card'>
          <img src='images/emergency.jpg' alt='Emergency Alert' />
          <h2>Emergency Alerts</h2>
          <p>Our system detects severe symptoms and can quickly connect you to emergency services when needed.</p>
        </div>

        <div className='service-card'>
          <img src='images/community.jpg' alt='Health Community' />
          <h2>Virtual Health Community</h2>
          <p>Join discussions, ask questions, and get advice from healthcare professionals and other patients.</p>
        </div>
      </section>
      <footer className='hcs-footer'>
        <p>© 2025 HealthConnect | All Rights Reserved</p>
      </footer>
    </div>
  )
}
