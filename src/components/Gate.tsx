import React, { useContext } from 'react';
import type { ReactNode } from 'react';
import { authCreatedContext } from '../context/AuthContext';
import Login from '../pages/login/Login';
import { Navigate, useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {

  const { token } = useContext(authCreatedContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
    </>
  );
}