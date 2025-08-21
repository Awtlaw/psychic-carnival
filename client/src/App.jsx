import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import { Login } from './pages/login/login'
import { PatientSignUp } from './pages/signup/patientSignUp'
import { DocSignUp } from './pages/signup/docSignUp'
import Report from './pages/reports/report'
import Doctor from './pages/history/doctor'
import { Land } from './pages/landingpage/land'
import { About } from './pages/about/about'
import { Service } from './pages/service/service'
import { Contact } from './pages/contact/contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Land />} />
        <Route path='home' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/service' element={<Service />} />
        <Route path='contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/history' element={<Doctor />} />
        <Route path='/reports' element={<Report />} />
        <Route path='/register-patient' element={<PatientSignUp />} />
        <Route path='/register-doctor' element={<DocSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
