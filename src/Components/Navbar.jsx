import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { removeCookie } from '../Utilities/resuable'
import "./../Styles/Nav.css"
import toast from 'react-hot-toast'
function Navbar() {
  const navigate=useNavigate()
  async function logout(){
    await removeCookie()
    toast.success("User logged out...!")
   navigate('/login')
  }
  return (
     <nav className='px-2 py-2 fixed-top d-flex align-items-center justify-content-between gap-5 text-light bg-transparent shadow'>
       <NavLink to={'/'} id='link' className={`fw-bold fs-2 text-warning`}>OnTrack</NavLink>
       <div className='d-flex align-items-center justify-content-center gap-2'>
        <NavLink to={'/login'} id='link' className={`text-light`}><span className='px-2'><i className="fa fa-sign-in" aria-hidden="true"></i></span> Login</NavLink>
        <button onClick={logout} className='border-0 bg-transparent text-light'><span className='px-2'><i className="fa fa-sign-out" aria-hidden="true"></i></span>Logout</button>
        <NavLink to={'/signup'} id='link' className={`bg-info py-1 px-3 rounded shadow text-light`}>Register</NavLink>
       </div>
     </nav>
    )
}

export default Navbar