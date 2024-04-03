import React from 'react'
import { Form,Link, useActionData, useNavigation,redirect } from 'react-router-dom';
import convertToBase from '../Utilities/convertToBase64';
import {  updateUserDetails } from '../Utilities/api';
import avatar from "./../Images/Blackvariant-Button-Ui-System-Folders-Alt-Users.512.png"
import  toast, { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
import "./../Styles/Dashbody.css"
import logo from "./../Images/Ontracj by AGCC.png"

export async function action({ request }) {
    try {
        const formData = await request.formData();

        // Extract form data
        const email = formData.get("email");
        const name = formData.get("name");
        const residentials = formData.get("residentials");
        const department = formData.get("department");
        const worker = formData.get("worker");
        const mobileNumber = formData.get("mobileNumber");

        // Get the uploaded image file
        const photo = formData.get("image");
        // Create a new FormData object to append both form data and image
        const formDataWithImage = new FormData();
        formDataWithImage.append("email", email);
        formDataWithImage.append("name", name);
        formDataWithImage.append("worker", worker);
        formDataWithImage.append("residentials", residentials);
        formDataWithImage.append("department", department);
        formDataWithImage.append("mobileNumber", mobileNumber);
        formDataWithImage.append("image", photo);

        // Call the signUpUser function with the combined form data
        const fetchedData = await updateUserDetails(formDataWithImage);
        if (fetchedData && fetchedData.data) {
            setTimeout(()=>{
                toast.success("User detail update was successful.");
            },250)
            throw redirect("/")
        }
        return fetchedData;
    } catch (err) {
        return err;
    }
}
function UpdateAccount() {
    const navigation = useNavigation();
    const actionData=useActionData();
    const [profile,setProfile]=React.useState('')
  if(actionData) {
    errorMessageHandler(actionData,'Login was successful.','An error occur during QrCode Scanning,pls try again later/refresh.')
 }    
    //console.log(actionData)
    //const error=actionData?.error;
    const handleProfile=async (e)=>{
        if (e.target.files[0].type.startsWith('image/')) {
           // console.log(e.target.files[0])
            const base64=await convertToBase(e.target.files[0]);
            setProfile(base64)
        } else {
         toast.error("An error occur while reading the image,change image.")
        }
   }

  return (
<div className='rounded-3 my-3 pt-3 border-1 border-secondary shadow d-flex flex-column container pb-5 scrollable'>
            <div className='w-100 d-flex flex-column gap-2 align-items-center justify-content-center'>
                <img src={logo} alt="" width={180} height={60}/>
                <h3 className='text-center'>Update Account</h3>
            </div>
            <hr />
            <Toaster position='top-center' reverseOrder={false}></Toaster>
                      <div className="card bg-transparent border-0">
                          <div className="card-body py-md-4 border-0">
                          <Form method="PATCH" encType="multipart/form-data">
                             <div className='form-group mx-auto d-flex align-items-center flex-column mb-3'>
                                <label htmlFor="file" className='text-center' style={{cursor: 'pointer'}}>
                                <img src={profile || avatar} className='rounded-circle' alt="" style={{width: '120px',height: '120px'}} />
                                </label>
                                <input onChange={handleProfile} type="file" id="file" accept="image/*" name="image" className="d-none" />
                            </div>

                            <div className="form-group">
                                <input type="text" className="form-control rounded-4 py-3 shadow" id="name" placeholder="full-name" name='name'/>
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control rounded-4 py-3 shadow" id="email" placeholder="Email" name='email' />
                            </div>                    
                              <div className="form-group">
                                  <input type="text" className="form-control rounded-4 py-3 shadow" id="mobileNumber" placeholder="mobile-number" name='mobileNumber' />
                              </div>                                    
                              <div className="form-group">
                                <input type="text" className="form-control rounded-4 py-3 shadow" id="residentials" placeholder="Residential Address " name='residentials' />
                            </div>
                            <div className="form-group d-flex flex-column align-items-center justify-content-between gap-2 text-black-50">
                                <label htmlFor="worker" aria-disabled className='border-1 fw-medium rounded-4 w-100 py-3 shadow bg-white px-3'>Are You A Worker?</label>
                                <ul className='w-100 bg-secondary-subtle rounded-4 shadow p-3'>
                                    <li className='d-flex flex-row align-items-center justify-content-between gap-5 p-0'>
                                        <label htmlFor="worker" className='text-dark fw-medium'>Yes</label>
                                        <input type="radio" name="worker" value={'Yes'} id="worker" />
                                    </li>
                                    <li className='d-flex flex-row align-items-center justify-content-between gap-5 p-0'>
                                        <label htmlFor="worker" className='text-dark fw-medium'>No</label>
                                        <input type="radio" name="worker" value={'No'} id="worker" />
                                    </li>
                                </ul>
                            </div>
                            <div className="form-group">
                            <input type='text' className="form-control rounded-4 py-3 shadow" id="department" placeholder="Department in Church" name='department' />
                        </div>
                           <div className="d-flex gap-2 flex-column align-items-center justify-content-between">
                                <button type='submit'  disabled={navigation.state === 'submitting'} className= {navigation.state === 'submitting' ? "w-100 shadow btn btn-secondary text-light fw-medium rounded-pill " : "w-100 shadow rounded-pill btn btn-warning text-light fw-medium"}>{navigation.state ==='submitting'? 'updating...' : 'Update'}</button>
                                <Link to={'..'} className='fw-medium text-warning'>back</Link>
                            </div>
                        </Form>
                      </div>
                  </div>
    </div>
  )
}

export default UpdateAccount