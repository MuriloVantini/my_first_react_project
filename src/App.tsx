import './index.css'
import Navbar from './components/navbar/navbar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <Navbar/>
      <div className='h-screen bg-gray-700'>

      <Outlet/>
      </div>
    </>
  )
}

export default App
