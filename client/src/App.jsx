import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import { Login } from './pages/login/login'
import { PatientSignUp } from './pages/signup/patientSignUp'
import { DocSignUp } from './pages/signup/docSignUp'
import Report from './pages/reports/report'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/PatientSignUp' element={<PatientSignUp />} />
        <Route path='/DocSignUp' element={<DocSignUp />} />
        <Route path='/reports' element={<Report />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
