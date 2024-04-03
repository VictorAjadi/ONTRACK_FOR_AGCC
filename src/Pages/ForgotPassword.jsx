import React from 'react'
import "../Styles/LoginStyle.css"
import { Form, Link, useActionData,useNavigation } from 'react-router-dom'
import { forgotPassword } from '../Utilities/api';
import  toast, { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
import logo from "./../Images/Ontracj by AGCC.png"

export async function action({request}){
    try{
        const formData=await request.formData()
        const email=formData.get("email");
        const fetchedData=await forgotPassword(email)
        if (fetchedData && fetchedData.data) {
                toast.success("Password reset link has been sent to mail and will expire in 5min.");
        }
        return fetchedData;
    }catch(err){
        return err
    }
}

function ForgotPassword() {
    const navigation = useNavigation();
    const actionData=useActionData();
    if(actionData) {
        errorMessageHandler(actionData,'Password reset link has been sent to mail and will expire in 5min.','An error occur during process,pls try again later.')
   }

    //console.log(actionData)
    //const error=actionData?.error;
    return (
          <div className="container pb-5 pt-4">
              <div className="row justify-content-center mt-5">
                  <div className="col-md-6 newCard mb-5">
                  <Toaster position='top-center' reverseOrder={false}></Toaster>
                      <div className="card border-0 bg-transparent my-5">
                        <div className='w-100 d-flex align-items-center justify-content-center mb-2'>
                          <img src={logo} alt="" width={190} height={70}/>
                        </div>
                        <p className="card-title text-center text-warning my-2 fw-medium">Enter Your Email To Get Password Reset Link</p>
                          <div className="card-body py-md-4">
                          <Form method="POST">
                              <div className="form-group">
                                  <input type="email" className="form-control rounded-4 py-3 shadow" id="email" placeholder="enter your email" name='email' />
                              </div>                                    
                             <div className="d-flex flex-column align-items-center justify-content-between mt-4 mb-3">
                                  <button type='submit' disabled={navigation.state === 'submitting'} className= {navigation.state === 'submitting' ? "w-100 btn btn-secondary text-light fw-medium rounded-pill" : "w-100 rounded-pill btn btn-warning text-light fw-medium"}>{navigation.state==='submitting'? 'Generating...' : 'Generate'} </button>
                                  <Link to={'/login'} className='fw-medium text-warning'>Login</Link>
                              </div>
                          </Form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>  
    )
}

export default ForgotPassword