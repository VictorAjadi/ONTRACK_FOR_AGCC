import React from 'react'
import "./../Styles/Dashbody.css"
import avatar from "./../Images/Blackvariant-Button-Ui-System-Folders-Alt-Users.512.png"
import { deleteUser, getOneUser } from '../Utilities/api';
import { Await,defer,useLoaderData, useNavigate } from 'react-router-dom';
import { Authentication } from '../Auth/AuthRequired';

export async function loader(){
  await Authentication()
  const user=await getOneUser();
  return defer({user})
}

function Profile() {
   const loaderData=useLoaderData();
   const navigate=useNavigate();
   async function handleDeleteAcc(){
    await deleteUser()
    navigate("/login")
   }
  return (
    <div className='container pb-4 scrollable'>
          <Await resolve={loaderData.user}>
            {(user)=>{
            return(
              <>
              <div className='rounded-3 shadow box-profile d-flex align-items-center justify-content-center flex-column'>
                  <img src={user.data.user.photo || avatar} className='box-img-sm rounded-circle' alt="" />
                </div>
                <h1 className='text-center my-2'>{user.data.user.name}</h1>
{/*                 <p className='text-center'><span>{user.data.user.state}</span>,<span>{user.data.user.country}</span></p> */}
                <div className='rounded-3 py-3 border-1 border-secondary shadow d-flex flex-column'>
                    <h3 className='px-3'>Profile</h3>
                    <hr />
                    <div className='py-3 ms-4'>
                        <p className='text-secondary py-2'>ABOUT</p>
                        <p className='fw-medium'><span className='text-secondary pe-3'><i className="fa fa-user" aria-hidden="true"></i></span>{user.data.user.name}</p>
{/*                         <p className='fw-medium'><span className='text-secondary pe-3'><i className="fa fa-envelope" aria-hidden="true"></i></span>{user.data.user.unit}</p>
                        <p className='fw-medium'><span className='text-secondary pe-3'><i className="fa fa-home" aria-hidden="true"></i></span>{user.data.user.subUnit}</p> */}
                    </div>
                    <div className='py-3 ms-4'>
                        <p className='text-secondary py-2'>CONTACTS</p>
                        <p className='fw-medium'><span className='text-secondary pe-3'>@</span> {user.data.user.email}</p>
                        <p className='fw-medium'><span className='text-secondary pe-3'><i className="fa fa-phone-square" aria-hidden="true"></i></span>{user.data.user.mobileNumber}</p>
                        <p className='fw-medium'><span className='text-secondary pe-3'><i class="fa fa-location-arrow" aria-hidden="true"></i></span>{user.data.user.residentials}</p>
                    </div>
                    <div className='py-3 ms-4'>
                        <p className='text-secondary py-2'>LOGIN ACTIVITY TIME</p>
                        {user.data.user.loginAt.map((each,i)=>(
                        <p className='fw-medium' key={i}><span className='text-secondary pe-3'><i className="fa fa-folder" aria-hidden="true"></i></span>Login At: {each}</p>
                        ))}
                        <img src={user.data.user.barcode} alt="" className='mx-auto my-3' />
                    </div>
                    <hr />
                    <button onClick={handleDeleteAcc} className='text-light bg-danger border-0 rounded p-2 mx-auto w-75 shadow'>DELETE ACCOUNT</button>
                </div>
                </>
              )
              }
            }
          </Await>
    </div>
  )
}

export default Profile



