import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from "./../Images/Blackvariant-Button-Ui-System-Folders-Alt-Users.512.png"
import "./../Styles/Sidebar.css"
import { removeCookie } from '../Utilities/resuable'
import toast from 'react-hot-toast'
function Sidebar() {
  const navigate=useNavigate()
  async function logout(){
    await removeCookie()
    toast.success("User logged out...!")
   navigate('/login')
  }
  return (
    <div className='big-h py-3 px-2 d-flex align-items-center justify-content-between flex-column bg-secondary'>
      <div className='d-flex align-items-center justify-content-between flex-column '>
            <img src={avatar} alt="" className='min-w'/>
            <hr className='text-warning border-5'/>
            <Link to="/" id='link' className='fw-medium text-light py-2 text-end'>Activity</Link>
            <Link to="/" id='link' className='fw-medium text-light py-2 text-end'>Workspace</Link>
            <Link to="/" id='link' className='fw-medium text-light py-2 text-end'>Profile</Link>
      </div>
      <div className='d-flex align-items-center justify-content-between gap-3 flex-column'>
        <Link to="/update/account" id='link'className={`bg-warning py-1 px-3 rounded shadow text-light border-0`}>Update</Link>
        <button onClick={logout} className={`bg-warning py-1 px-3 rounded shadow text-light border-0`}>Logout</button>
      </div>
    </div>
  )
}

export default Sidebar