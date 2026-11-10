import React, { useContext } from 'react'
import { authCreatedContext } from '../context/AuthContext'
import Login from "../pages/login/Login"
import { Navigate, useNavigate } from 'react-router-dom'

export default function ProtectedRoute( {children} ) {
  




 const {token} = useContext (authCreatedContext)

 if (! token) {

  return  <Navigate to={"/login"} />



 }



return(
   <>
   
   {children}
   </>
  )
}
