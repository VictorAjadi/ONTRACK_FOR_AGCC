import React from 'react'
import "../Styles/LoginStyle.css"
import { Form, Link, useActionData,useNavigation,redirect } from 'react-router-dom'
import { loginUser } from '../Utilities/api';
import  { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
/* import { createBrowserHistory } from 'history';
const history = createBrowserHistory(); */
import logo from "./../Images/Ontracj by AGCC.png"

export async function action({ request }) {
    try {
        const formData = await request.formData();
        const email = formData.get("email");
        const password = formData.get("password");
        const details = {
            email,
            password
        };
        const fetchedData = await loginUser(details);

        if (fetchedData && fetchedData.data) {
            throw redirect("/")
         }
     return fetchedData;
    } catch (err) {
        return err;
    }
}


function Login() {
    const navigation = useNavigation();
/*     const navigate=useNavigate() */
    const actionData=useActionData();
      if(actionData) {
        errorMessageHandler(actionData,'Login was successful.','An error occur during process,pls try again later.')
       }

    return (
          <div className="container">
              <div className="row justify-content-center mt-5">
                  <div className="col-md-6 newCard mb-5">
                  <Toaster position='top-center' reverseOrder={false}></Toaster>
                      <div className="card border-0 bg-transparent my-2">
                        <div className='w-100 d-flex align-items-center justify-content-center mb-2'>
                            <img src={logo} alt="" width={190} height={70}/>
                            </div>
{/*                           <h2 className="card-title text-center text-secondary mb-4 mt-2">Login <span className='text-warning fw-bold display-6'>OnTrack</span></h2> */}
                          <div className="card-body py-md-4">
                          <Form method="POST">
                              <div className="form-group">
                                  <input type="email" className="form-control rounded-4 py-3 shadow " id="email" placeholder="Email" name='email' />
                              </div>                                    
                              <div className="form-group">
                                  <input type="password" className="form-control rounded-4 py-3 shadow " id="password" placeholder="Password" name='password' />
                              </div>
                              <p className='text-center text-warning fw-medium'>Complete your Believer's Class to get your Membership Serial Number</p>
                             <div className="d-flex align-items-center justify-content-between mb-3 flex-column">
                                  <button type='submit' disabled={navigation.state === 'submitting'} className= {navigation.state === 'submitting' ? "btn btn-secondary w-100 text-light fw-medium rounded-pill shadow py-2" : "py-2 shadow rounded-pill w-100 btn btn-warning text-light fw-medium"}>{navigation.state==='submitting'? 'Logging in...' : 'Login'} </button>
                                  <div className='my-2 gap-1 d-flex flex-sm-row flex-lg-row flex-md-row flex-column align-items-center justify-content-between'>
                                    <Link to={'/forgot/password'} className='text-warning'>forgot password ?</Link>
                                    <Link to={'/barcode'} className='text-warning '>Login with QrCode</Link>
                                  </div>
                                  <Link to={'/signup'} className='fw-medium text-warning my-1'>Not a member of AGCC Yet? Become a Member</Link>
                              </div>
                          </Form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>  
    )
}

export default Login