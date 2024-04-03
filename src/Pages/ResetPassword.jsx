import React from 'react'
import "../Styles/LoginStyle.css"
import { Form, useActionData,useNavigation,redirect } from 'react-router-dom'
import { resetPassword } from '../Utilities/api';
import  toast, { Toaster } from 'react-hot-toast';
import { errorMessageHandler } from '../Utilities/errorMessageHandler';
import logo from "./../Images/Ontracj by AGCC.png"

export async function action({request,params}){
    localStorage.removeItem('resetTimer')
    try{
        const formData=await request.formData()
        const confirmPassword=formData.get("confirmPassword");
        const password = formData.get("password")   
        const details={
            confirmPassword,password
        }
        const fetchedData=await resetPassword(params.resetToken,details)
        //console.log(fetchedData)
        if (fetchedData && fetchedData.data) {
            setTimeout(()=>{
                toast.success("your password password has successfully been resetted.");
            },500)
            throw redirect("/")
        }
            return fetchedData;
    }catch(err){
        return err
    }
}

function ResetPassword() {
    const navigation = useNavigation();
    const actionData=useActionData();
    const [timer, setTimer] = React.useState(localStorage.getItem('resetTimer')*1 || 0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer =>{
                if(prevTimer>=300){
                    localStorage.setItem('resetTimer', 300)
                    return 300;
                }
                localStorage.setItem('resetTimer', (prevTimer + 1))
                return prevTimer + 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            localStorage.removeItem('resetTimer')
        } 
    });

    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    if(actionData) errorMessageHandler(actionData,'your password password has successfully been resetted.','An error occur during process,pls try again later.')
    //console.log(actionData)
    //const error=actionData?.error;
    return (
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-md-6 newCard mb-5">
                  <Toaster position='top-center' reverseOrder={false}></Toaster>
                      <div className="card shadow-lg border border-1 border-info bg-transparent">
                        <div className='w-100 d-flex align-items-center justify-content-center'>
                          <img src={logo} alt="" width={190} height={70}/>
                        </div>
                          <p className="card-title text-center text-secondary my-4 fw-medium">Enter Your New Password For Reset</p>
                          <div className="card-body py-md-4">
                          <Form method="PATCH">                              
                              <div className="form-group">
                                  <input type="password" className="form-control" id="password" placeholder="Password" name='password' />
                              </div>
                              <div className="form-group">
                                  <input type="password" className="form-control" id="confirm-password" placeholder="confirm-password" name='confirmPassword' />
                              </div>
                             <div className="d-flex flex-row align-items-center justify-content-between mt-2 mb-3">
                                  <p className='text-warning'>Timer: {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}</p>
                                  <button type='submit' disabled={navigation.state === 'submitting'} className= {navigation.state === 'submitting' ? "btn btn-secondary text-light fw-medium" : "btn btn-warning text-light fw-medium"}>{navigation.state==='submitting'? 'Reseting...' : 'Reset'} </button>
                              </div>
                          </Form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>  
    )
}

export default ResetPassword