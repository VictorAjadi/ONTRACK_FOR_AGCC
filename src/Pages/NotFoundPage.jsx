import React from 'react'
import not from './../Images/—Pngtree—ilustration boy uaing binoculars equipment_7694297.png'
import { NavLink } from 'react-router-dom'

function NotFoundPage() {
  return (
      <div className={`bg-transparent d-flex flex-column mt-5 py-5`} style={{height:'100%',width: '100%'}}>
          <div className='rounded-3 d-flex justify-content-center align-items-center bg-secondary p-4 mx-auto shadow-lg'>
            <p className='fw-bold text-warning fs-3'>404!Page Not Found...!!</p>
            <img src={not} alt=""  style={{height:'150px',width:'150px'}}/>
          </div>
          <NavLink to={'..'} id='link' relative='path' className={'text-light py-2 px-4 rounded shadow border-0 mx-auto bg-warning bg-gradient mt-4 fw-medium'}>Return Back To Previous Page</NavLink>
      </div>
  )
}

export default NotFoundPage