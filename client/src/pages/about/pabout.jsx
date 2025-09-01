import { Link } from 'react-router-dom'
import './about.css'
export function Pabout() {
  return (
    <div className='about-page'>
      <nav className='about-navbar'>
        <div className='about-logo'>HealthConnect</div>
        <ul>
          <li>
            <Link to='/home'>Home</Link>
          </li>
          <li>
            <Link to='/pabout'>About</Link>
          </li>
          <li>
            <Link to='/pservice'>Services</Link>
          </li>
          <li>
            <Link to='/pcontact'>Contact</Link>
          </li>
          <li>
            <Link to='/logOut'>LogOut</Link>
          </li>
        </ul>
      </nav>

      <header className='about-header'>
        <h1 className='hd'>
          About <span>HealthConnect</span>
        </h1>
        <p>Your trusted AI-powered healthcare companion</p>
      </header>

      <section className='about-section'>
        <div className='about-image'>
          <img src='doc.png' alt='Healthcare team' />
        </div>
        <div className='about-content'>
          <h2>Who We Are</h2>
          <p>
            HealthConnect is an innovative platform designed to improve medical diagnosis and clinical decision-making using the power of
            Artificial Intelligence. Our mission is to provide patients with reliable symptom checking, easy appointment booking, and access
            to trusted medical professionals.
          </p>
          <p>We believe in making healthcare more accessible, efficient, and patient-centered.</p>
        </div>
      </section>

      <section className='about-mission'>
        <h2>Our Mission</h2>
        <p>
          To connect patients with AI-driven tools and qualified doctors, ensuring faster and more accurate medical support — anytime,
          anywhere.
        </p>
      </section>

      <section className='about-team'>
        <h2>Meet Our Team</h2>
        <div className='about-team-container'>
          <div className='about-team-card'>
            <img src='nic.jpg' alt='Team Member' />
            <h3>Dr. Nicholette Mensah</h3>
            <p>Chief Medical Advisor</p>
          </div>
          <div className='about-team-card'>
            <img src='mj.jpg' alt='Team Member' />
            <h3>Youngson Ahiase</h3>
            <p>Lead Developer</p>
          </div>
          <div className='about-team-card'>
            <img src='anni.jpg' alt='Team Member' />
            <h3> Anne Jolie</h3>
            <p>AI Research Specialist</p>
          </div>
        </div>
      </section>

      <footer className='about-footer'>
        <p>&copy; 2025 HealthConnect. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
