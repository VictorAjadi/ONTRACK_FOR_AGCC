import React from 'react'
import { getOneUser } from '../Utilities/api';
import { Navigate, Outlet, defer, useLoaderData } from 'react-router-dom';

export async function loader(){
  const user=await getOneUser();
  return defer({user})
}

function ProtectedRoute({children,redirectTo}) {
    const loaderData=useLoaderData();
    console.log(loaderData)

  return (
    {children}
  )
}

export default ProtectedRoute