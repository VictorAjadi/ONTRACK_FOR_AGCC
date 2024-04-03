import React from 'react'
import Sidebar from '../Components/Sidebar'
import "./../Styles/Dashbody.css"
import { Outlet } from 'react-router-dom'
import Helmet from 'react-helmet';

function Dashboard() {
  return (
    <>
      <Helmet>
      <title>ONTRACK | AGCC</title>
      <link rel="icon" type="image/x-icon" href="./../Images/Ontracj%20by%20AGCC.png" /> {/* Escape special characters */}
      </Helmet>
      <div className='d-flex'>
        <Sidebar/>
          <Outlet/>
    </div>
    </>
  )
}

export default Dashboard