import React from 'react'
import "../Styles/SignStyle.css"
import { Form, Link, useActionData,useNavigation,redirect } from 'react-router-dom'
import { signUpUser } from '../Utilities/api';
import avatar from "./../Images/Blackvariant-Button-Ui-System-Folders-Alt-Users.512.png"
import convertToBase from '../Utilities/convertToBase64';
import  toast, { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
import logo from "./../Images/Ontracj by AGCC.png"

export async function action({ request }) {
    try {
        const formData = await request.formData();

        // Extract form data
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        const confirmPassword = formData.get("confirmPassword");
        const worker = formData.get("worker");
        const residentials = formData.get("residentials");
        const department = formData.get("department");
        const mobileNumber = formData.get("mobileNumber");

        // Get the uploaded image file
        const photo = formData.get("image");

        // Create a new FormData object to append both form data and image
       // console.log(email,password,confirmPassword,worker,residentials,department,mobileNumber,photo)
        const formDataWithImage = new FormData();
        formDataWithImage.append("email", email);
        formDataWithImage.append("password", password);
        formDataWithImage.append("name", name);
        formDataWithImage.append("confirmPassword", confirmPassword);
        formDataWithImage.append("worker", worker);
        formDataWithImage.append("residentials", residentials);
        formDataWithImage.append("department", department);
        formDataWithImage.append("mobileNumber", mobileNumber);
        formDataWithImage.append("image", photo);

        // Call the signUpUser function with the combined form data
        const fetchedData = await signUpUser(formDataWithImage);
        if (fetchedData && fetchedData.data) {
            setTimeout(()=>{
                toast.success("you've successfully registered with us,check mail for your QrCode.");
            },250)
            throw redirect("/")
        }
        return fetchedData;
    } catch (err) {
        return err;
    }
}

function SignUp() {
  const navigation = useNavigation();
  const actionData=useActionData();
  const [changeVisible,setChangeVisible]=React.useState(false)  
  const [profile,setProfile]=React.useState('')

  if(actionData) {
    errorMessageHandler(actionData,"you've successfully registered with us,check mail for your QrCode.",'An error occur during registering process,pls try again later.')  
 }

  const handleProfile=async (e)=>{
      if (e.target.files[0].type.startsWith('image/')) {
         // console.log(e.target.files[0])
          const base64=await convertToBase(e.target.files[0]);
          setProfile(base64)
      } else {
        toast.error("An error occur while reading the image,change image.")
      }
 }
  //const error=actionData?.error;
  return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 newCard">
                <Toaster position='top-center' reverseOrder={false}></Toaster>
                    <div className="card border-0 bg-transparent">
                        <div className='w-100 d-flex align-items-center justify-content-center mb-3'>
                         <img src={logo} alt="" width={190} height={70}/>
                        </div>
                        <p className={'card-title text-center text-secondary'} ><span className='text-warning fw-bold'>Join Us as We Experience Grace Like An Avalanche</span></p>
                        <div className="card-body py-md-4">
                        <Form method="POST" encType="multipart/form-data">
                            <section className={changeVisible ? 'd-none' : ''}>
                                <div className='form-group mx-auto d-flex align-items-center flex-column'>
                                    <label htmlFor="file" className='text-center' style={{cursor: 'pointer'}}>
                                    <img src={profile || avatar} className='rounded-circle' alt="" style={{width: '120px',height: '120px'}} />
                                    </label>
                                    <input onChange={handleProfile} type="file" id="file" accept="image/*" name='image' className='d-none' />
                                </div>

                                <div className="form-group">
                                    <input type="text" className="form-control rounded-4 py-3 shadow" id="name" placeholder="full-name" name='name'/>
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control rounded-4 py-3 shadow" id="email" placeholder="Email" name='email' />
                                </div>                    
                                                
                                <div className="form-group">
                                    <input type="password" className="form-control rounded-4 py-3 shadow" id="password" placeholder="Password" name='password' />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control rounded-4 py-3 shadow" id="confirmPassword" placeholder="confirm-password" name='confirmPassword' />
                                </div>
                                <p onClick={()=>setChangeVisible(prev=> !prev)} style={{'cursor': 'pointer'}} className='rounded-pill w-100 mx-auto text-center p-2 text-light border-0 shadow bg-warning fw-bold'>Next</p>
                                <div className='w-100 d-flex align-items-center justify-content-center mb-1'>
                                    <Link to={'/login'} className='fw-bold text-warning text-center'>Login</Link>
                                </div>
                            </section>

                            <section className={changeVisible ? '' : 'd-none'}>
                                <div className="form-group">
                                    <input type="text" className="form-control rounded-4 py-3 shadow" id="mobileNumber" placeholder="Phone Number" name='mobileNumber'/>
                                </div>                                    
                                <div className="form-group">
                                        <input type="text" className="form-control rounded-4 py-3 shadow" id="residentials" placeholder="Residential Address " name='residentials' />
                                    </div>
                                    <div className="form-group d-flex flex-column align-items-center justify-content-between gap-2 text-black-50">
                                        <label htmlFor="worker" aria-disabled className='border-1 fw-medium rounded-4 w-100 py-3 shadow bg-white px-3'>Are You A Worker?</label>
                                        <ul className='w-100 bg-secondary-subtle rounded-4 shadow p-3'>
                                            <li className='d-flex flex-row align-items-center justify-content-between gap-5 p-0'>
                                                <label htmlFor="worker" className='text-dark fw-medium'>Yes</label>
                                                <input type="radio" name="worker" value={'Yes'} id="worker_yes" />
                                            </li>
                                            <li className='d-flex flex-row align-items-center justify-content-between gap-5 p-0'>
                                                <label htmlFor="worker" className='text-dark fw-medium'>No</label>
                                                <input type="radio" name="worker" value={'No'} id="worker_no" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="form-group">
                                    <input type='text' className="form-control rounded-4 py-3 shadow" id="department" placeholder="Department in Church" name='department' />
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-between">
                                        <button type='submit'  disabled={navigation.state === 'submitting'} className= {navigation.state === 'submitting' ? "btn btn-secondary text-light fw-medium rounded-pill shadow py-2 w-100 d-flex align-items-center justify-content-between flex-row" : "d-flex align-items-center justify-content-between flex-row w-100 rounded-pill shadow py-2 btn btn-warning text-light fw-medium"}>{navigation.state ==='submitting'? 'COMPLETING...' : 'COMPLETE'} <span><i className="fa fa-chevron-right fs-4" aria-hidden="true"></i></span></button>
                                        <div className='d-flex align-items-center justify-content-between flex-column'>
                                          <p onClick={()=>setChangeVisible(prev=> !prev)} style={{'cursor': 'pointer'}} className='rounded-pill my-3 px-3 mx-auto text-center p-2 text-light border-0 shadow bg-warning fw-bold'>Back</p>
                                          <Link to={'/login'} className='fw-bold text-warning'>Login</Link>
                                        </div>
                                </div>
                            </section>
                        </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

  )
}

export default SignUp