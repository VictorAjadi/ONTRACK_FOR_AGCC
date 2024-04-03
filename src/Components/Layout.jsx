import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import './../Styles/Layout.css'
/* import Navbar from './Navbar' */
import Helmet from 'react-helmet';

function Layout() {
  return (
    <div className='css-gradient d-flex align-item-center justify-content-between flex-column'>
        <Helmet>
          <title>ONTRACK | AGCC</title>
          <link rel="icon" type="image/x-icon" href="./../Images/Ontracj%20by%20AGCC.png" /> {/* Escape special characters */}
        </Helmet>
      <div>
      {/*  <Navbar/> */}
       <div className='add-m add-vh'>
        <Outlet />
       </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Layout