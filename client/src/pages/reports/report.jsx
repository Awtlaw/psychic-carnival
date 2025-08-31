import { Summary } from '../../components/summary'
// import { Navbar } from '../../components/Navbar'
// import { Sidebar } from '../../components/sidebar'
import { Dnavbar } from '../../components/Dnavbar'

export default function Report() {
  return (
    <div>
      <Dnavbar />

      <div className='content'>
        {/* <Sidebar /> */}
        <div className='doc-main-content'>
          <Summary />
        </div>
      </div>
    </div>
  )
}
