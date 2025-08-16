import '../../style.css'
import { Navbar } from '../../components/Navbar'
import { Sidebar } from '../../components/sidebar'
import { Main } from '../../components/main'

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className='content'>
        <Sidebar />
        <div className='main-content'>
          <Main />
        </div>
      </div>
    </div>
  )
}
