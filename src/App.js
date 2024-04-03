import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import SignUp,{action as signUpAction} from './Pages/SignUp';
import Login,{action as loginAction} from './Pages/Login';
import ResetPassword,{action as resetPasswordAction} from './Pages/ResetPassword';
import ForgotPassword,{action as forgotPasswordAction} from './Pages/ForgotPassword';
import Layout from './Components/Layout';
import NotFoundPage from './Pages/NotFoundPage';
import Error from './Components/Error';
import Dashboard from './Pages/Dashboard';
import Profile,{loader as profileLoader} from './Components/Profile';
import UpdateAccount,{action as updateAction} from './Components/UpdateAccount';
import BarcodeScanner from './Pages/BarcodeScanner';
import { Authentication } from './Auth/AuthRequired';


function App() {
   const router = createBrowserRouter(createRoutesFromElements(
      <>
         <Route errorElement={<Error/>} path='/' element={<Dashboard/>}>
            <Route index element={<Profile/>} loader={profileLoader}/>  
            <Route path='/update/account' element={<UpdateAccount/>} loader={async()=>{
               await Authentication()
               return null
            }} action={updateAction}/>  
         </Route>
         <Route path='/' errorElement={<Error/> } element={<Layout/>}>
            <Route path='signup' element={<SignUp/>} action={signUpAction} />
            <Route path='login' element={<Login/>} action={loginAction} />
            <Route path='reset/password/:resetToken' element={<ResetPassword/>} action={resetPasswordAction} />
            <Route path='forgot/password' element={<ForgotPassword/>} action={forgotPasswordAction} />
            <Route path='barcode' element={<BarcodeScanner/>}  />
            <Route path='*' element={<NotFoundPage/>}/>
         </Route>
      </>
      ));
  
  return (
      <RouterProvider router={router} />
  );
}

export default App;
