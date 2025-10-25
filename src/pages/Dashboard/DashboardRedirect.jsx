import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';

const DashboardRedirect = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!user || !user.tipo) {
    return <Navigate to="/" replace />;
  }

  switch (user.tipo) {
    case 'nodo':
      return <Navigate to="/dashboard/nodo" replace />;
    case 'emprendedor':
      return <Navigate to="/dashboard/emprendedor" replace />;
    case 'mentor':
      return <Navigate to="/dashboard/mentor" replace />;
    case 'inversor':
      return <Navigate to="/dashboard/inversor" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardRedirect;