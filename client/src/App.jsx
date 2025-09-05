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
import PageNotFound from './pages/error/page'
import { ProtectRoute } from './components/protectRoute'
import { Dabout } from './pages/about/dabout'
import { Pabout } from './pages/about/pabout'
import { Dcontact } from './pages/contact/dcontact'
import { Pcontact } from './pages/contact/pcontact'
import { Pservice } from './pages/service/pservice'
import { Dservice } from './pages/service/dservice'
import Admin from './pages/admin/admin'
import { Summary } from './components/summary'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<PageNotFound />} />
        <Route path='/' element={<Land />} />
        <Route path='/about' element={<About />} />
        <Route path='/service' element={<Service />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register-patient' element={<PatientSignUp />} />
        <Route path='/register-doctor' element={<DocSignUp />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/summary' element={<Summary />} />
        <Route
          path='home'
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          }
        />
        <Route path='/dabout' element={<Dabout />} />
        <Route path='/pabout' element={<Pabout />} />
        <Route path='/dcontact' element={<Dcontact />} />
        <Route path='/Pcontact' element={<Pcontact />} />
        <Route path='/pservice' element={<Pservice />} />
        <Route path='/dservice' element={<Dservice />} />

        <Route path='reports'>
          <Route element={<Doctor />} index={true} />
          <Route element={<Report />} path=':id' />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
