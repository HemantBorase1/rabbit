import  'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
    {/* Header Section */}
    <Header/>
    {/* Main Content */}
    <main>
      <Outlet/>
    </main>
    {/* Footer Section */}
    <Footer/>
    </>
  )
}

export default UserLayout