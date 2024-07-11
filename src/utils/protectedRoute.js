import React from 'react'
import {Navigate, Outlet } from "react-router-dom";
import session from "shared/session";

const ProtectedRoute = () => {
  const isAuthenticated = session.Retrieve("isAuthenticated",true);
    return (
        isAuthenticated ? <Outlet/> : <Navigate to='/login'/>
      )
};

export default ProtectedRoute;