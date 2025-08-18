import { Summary } from '../../components/summary'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/sidebar'

export default function Report() {
  return (
    <div>
      <Navbar />

      <div className='content'>
        <Sidebar />
        <div className='doc-main-content'>
          <Summary />
        </div>
      </div>
    </div>
  )
}
