// import './land.css'
// export function Land() {
//   return (
//     <div className='main-landing-container'>
//       {/* Navbar  */}
//       <nav className='nav1'>
//         <a href='#' className='brand'>
//           HealthConnect
//         </a>
//         <ul className='nav-links'>
//           <li>
//             <a href='#'>Home</a>
//           </li>
//           <li>
//             <a href='#'>About Us</a>
//           </li>
//           <li>
//             <a href='#'>Products</a>
//           </li>
//           <li>
//             <a href='#'>Blog</a>
//           </li>
//         </ul>
//         <div>
//           <a href='#' className='btn btn-outline'>
//             Login
//           </a>
//           <a href='#' className='btn btn-custom'>
//             Sign Up
//           </a>
//         </div>
//       </nav>

//       {/* Hero  */}
//       <section className='hero'>
//         <h1>Introducing HealthConnect</h1>
//         <p>
//           In an increasingly complex and data-driven world, our AI solutions empower medical professionals, patients, and healthcare
//           organizations to make informed decisions, improve patient outcomes, and enhance healthcare experiences.
//         </p>
//         <a href='#' className='btn btn-custom'>
//           Explore Dashboard →
//         </a>
//         <div>
//           <img src='images/hero.png' alt='Health Dashboard' />
//         </div>
//       </section>

//       {/* Features  */}
//       <section className='features'>
//         <div className='feature-card'>
//           <h3>Clinical Reporting</h3>
//           <p>Streamline your healthcare journey with accurate reports and diagnosis, enabling personalized treatment plans.</p>
//           <a href='#' className='btn btn-custom'>
//             Learn More
//           </a>
//         </div>
//         <div className='feature-card'>
//           <h3>Symptom Checker</h3>
//           <p>Quickly identify potential health issues and make informed decisions about your well-being.</p>
//           <a href='#' className='btn btn-custom'>
//             Learn More
//           </a>
//         </div>
//         <div className='feature-card'>
//           <h3>Appointments</h3>
//           <p>Simplify scheduling with our convenient appointment booking feature.</p>
//           <a href='#' className='btn btn-custom'>
//             Learn More
//           </a>
//         </div>
//       </section>

//       {/* Signup CTA  */}
//       <section className='signup'>
//         <h2>Get Started with HealthConnect</h2>
//         <p>Sign up today and take control of your healthcare journey.</p>
//         <form>
//           <input type='email' placeholder='Email Address' required />
//           <input type='password' placeholder='Password' required />
//           <button type='submit' className='btn btn-custom'>
//             Sign Up
//           </button>
//         </form>
//       </section>

//       {/* Footer  */}
//       <footer>
//         <p>© 2025 HealthConnect. All rights reserved.</p>
//         <div>
//           <a href='#'>Twitter</a> |<a href='#'>Instagram</a> |<a href='#'>Facebook</a>
//         </div>
//       </footer>
//     </div>
//   )
// }

import './land.css'

export function Land() {
  return (
    <div className='hc-landing'>
      <div className='hc-main-landing-container'>
        {/* Navbar  */}
        <nav className='hc-nav'>
          <a href='#' className='hc-brand'>
            HealthConnect
          </a>
          <ul className='hc-nav-links'>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#'>About Us</a>
            </li>
            <li>
              <a href='#'>Products</a>
            </li>
            <li>
              <a href='#'>Blog</a>
            </li>
          </ul>
          <div>
            <a href='#' className='hc-btn hc-btn-outline'>
              Login
            </a>
            <a href='#' className='hc-btn hc-btn-custom'>
              Sign Up
            </a>
          </div>
        </nav>

        {/* Hero  */}
        <section className='hc-hero'>
          <h1>Introducing HealthConnect</h1>
          <p>
            In an increasingly complex and data-driven world, our AI solutions empower medical professionals, patients, and healthcare
            organizations to make informed decisions, improve patient outcomes, and enhance healthcare experiences.
          </p>
          <a href='#' className='hc-btn hc-btn-custom'>
            Explore Dashboard →
          </a>
          <div>
            <img src='images/hero.png' alt='Health Dashboard' />
          </div>
        </section>

        {/* Features  */}
        <section className='hc-features'>
          <div className='hc-feature-card'>
            <h3>Clinical Reporting</h3>
            <p>Streamline your healthcare journey with accurate reports and diagnosis, enabling personalized treatment plans.</p>
            <a href='#' className='hc-btn hc-btn-custom'>
              Learn More
            </a>
          </div>
          <div className='hc-feature-card'>
            <h3>Symptom Checker</h3>
            <p>Quickly identify potential health issues and make informed decisions about your well-being.</p>
            <a href='#' className='hc-btn hc-btn-custom'>
              Learn More
            </a>
          </div>
          <div className='hc-feature-card'>
            <h3>Appointments</h3>
            <p>Simplify scheduling with our convenient appointment booking feature.</p>
            <a href='#' className='hc-btn hc-btn-custom'>
              Learn More
            </a>
          </div>
        </section>

        {/* Signup CTA  */}
        <section className='hc-signup'>
          <h2>Get Started with HealthConnect</h2>
          <p>Sign up today and take control of your healthcare journey.</p>
          <form>
            <input type='email' placeholder='Email Address' required />
            <input type='password' placeholder='Password' required />
            <button type='submit' className='hc-btn hc-btn-custom'>
              Sign Up
            </button>
          </form>
        </section>

        {/* Footer  */}
        <footer className='hc-footer'>
          <p>© 2025 HealthConnect. All rights reserved.</p>
          <div>
            <a href='#'>Twitter</a> |<a href='#'>Instagram</a> |<a href='#'>Facebook</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
