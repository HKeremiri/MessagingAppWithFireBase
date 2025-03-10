import React from 'react'
import { Navigate } from 'react-router-dom';
function ProtectedRoute({ isAuth, children }) {
    if (!isAuth) {
      console.log("Protectedroute :", isAuth )
      return <Navigate to="/login" />;
    }
    return children;
  }

export default ProtectedRoute