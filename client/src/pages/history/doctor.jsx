import { Dnavbar } from '../../components/Dnavbar'
import { History } from '../../components/history'
// import { Navbar } from '../../components/Navbar'
// import { Sidebar } from '../../components/sidebar'

export default function Doctor() {
  return (
    <div>
      <Dnavbar />

      <div className='content'>
        {/* <Sidebar /> */}
        <div className='history-main-container'>
          <History />
        </div>
      </div>
    </div>
  )
}
