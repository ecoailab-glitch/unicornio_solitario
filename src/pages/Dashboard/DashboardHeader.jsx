import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, LogOut, BarChart3, UserCheck, Filter } from 'lucide-react';

const getPhaseColor = (fase) => {
  const colors = {
    'nodo': 'phase-unicornio', 
    'emprendedor': 'phase-semilla',
    'mentor': 'phase-pegaso',
    'inversor': 'phase-dragon',
  };
  return colors[fase] || 'bg-gray-500';
};

const DashboardHeader = ({ user, logout, toast }) => {
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
            {user.tipo && (
              <Badge className={`${getPhaseColor(user.tipo)} text-white`}>
                {user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1)}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast({ title: "Notificaciones", description: "No tienes notificaciones nuevas" })}
              className="text-gray-300 hover:text-white"
            >
              <Bell className="w-5 h-5" />
            </Button>
            
            {user.tipo === 'nodo' && (
              <>
                <Button
                  onClick={() => navigate('/funnel')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                  size="sm"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Embudo
                </Button>
                <Button
                  onClick={() => navigate('/metricas')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                  size="sm"
                >
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Métricas
                </Button>
                <Button
                  onClick={() => navigate('/mentor-simulation')}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 hidden sm:flex"
                  size="sm"
                >
                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Sim. José Luis
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              onClick={logout}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              size="sm"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;