import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const DashboardRedirect = () => {
  const { user } = useUser();

  if (!user || !user.tipo) {
    return <Navigate to="/" />;
  }

  switch (user.tipo) {
    case 'nodo':
      return <Navigate to="/dashboard/nodo" />;
    case 'emprendedor':
      return <Navigate to="/dashboard/emprendedor" />;
    case 'mentor':
      return <Navigate to="/dashboard/mentor" />;
    case 'inversor':
      return <Navigate to="/dashboard/inversor" />;
    default:
      return <Navigate to="/" />;
  }
};

export default DashboardRedirect;