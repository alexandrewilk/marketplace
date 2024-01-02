import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import {useAuthStatus} from '../../hooks/useAuthStatus'
import { Dots } from "react-activity";
import "react-activity/dist/library.css";

export default function PrivateRoute() {
    const{loggedIn, loading} = useAuthStatus();
    if(loading){
        return(<Dots/>)
    }
  return loggedIn ? <Outlet/> : <Navigate to='/sign-in'/>
}
