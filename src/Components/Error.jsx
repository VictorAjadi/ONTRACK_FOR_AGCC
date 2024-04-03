import React from 'react'
import not from './../Images/—Pngtree—ilustration boy uaing binoculars equipment_7694297.png'
import { NavLink, useRouteError } from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './Footer';

function Error() {
 const error=useRouteError();
  return (
    <div className='css-gradient d-flex align-item-center justify-content-between flex-column gap-5'>
      <Navbar/>
      <div className={`bg-transparent d-flex flex-column my-5 py-5`}>
          <div className='rounded-3 d-flex justify-content-center align-items-center bg-secondary p-4 mx-auto mt-5 mb-4 shadow-lg'>
            <div>
              <p className='fw-bold text-warning fs-3 text-wrap'>{error.message || 'An error occured try again in few momment time.'}...!!</p>
              <pre className='fs-4'><span className='text-danger'>{error.statusCode || 404}</span> - {error.status || 'error'}</pre>
            </div>
            <img src={not} alt=""  style={{height:'100px',width:'100px'}}/>
          </div>
          <NavLink to={'..'} id='link' className={'text-light py-2 px-4 rounded shadow border-0 mx-auto bg-warning bg-gradient mt-5 fw-medium'}>Return Back To Previous Page</NavLink>
      </div>
      <Footer/>
     </div>
  )
}

export default Error