import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/sidebar'

export default function Report() {
  return (
    <div>
      <Navbar />

      <div className='content'>
        <Sidebar />
        <div className='main-content'></div>
      </div>
    </div>
  )
}
