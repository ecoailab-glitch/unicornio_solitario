import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';

import WelcomeScreen from './WelcomeScreen';
import ProfileScreen from './ProfileScreen';
import AnnualSimulationScreen from './AnnualSimulationScreen';
import HighImpactSimulationScreen from './HighImpactSimulationScreen';
import ActiveProjectsScreen from './ActiveProjectsScreen';
import AddProjectScreen from './AddProjectScreen';
import TechEvolutionScreen from './TechEvolutionScreen';

import { mariaAlonsoData, initialProjects } from './constants';


const MentorSimulationPresentation = () => {
  const navigate = useNavigate();
  const { projects, addProject } = useProjects();
  const { toast } = useToast();
  const [currentScreen, setCurrentScreen] = useState(1);

  const [mentorProjects, setMentorProjects] = useState([]);

  useEffect(() => {
    const mariaProjectsFromContext = projects.filter(p => p.mentor === mariaAlonsoData.nombreCompleto);
     if (mariaProjectsFromContext.length === 0) {
        initialProjects.forEach(p => {
             if (p.mentor === mariaAlonsoData.nombreCompleto) {
                const existing = projects.find(ep => ep.nombre === p.nombre && ep.mentor === p.mentor);
                if(!existing) addProject(p);
            }
        });
    }
    setMentorProjects(projects.filter(p => p.mentor === mariaAlonsoData.nombreCompleto));
  }, [projects, addProject]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <WelcomeScreen />;
      case 2:
        return <ProfileScreen mariaAlonsoData={mariaAlonsoData} projectsCount={mentorProjects.length} />;
      case 3:
        return <AnnualSimulationScreen />;
      case 4:
        return <HighImpactSimulationScreen />;
      case 5:
        return <ActiveProjectsScreen 
                  mentorProjects={mentorProjects} 
                  navigate={navigate} 
                  setCurrentScreen={setCurrentScreen} 
                  mariaAlonsoData={mariaAlonsoData} 
                  onOpenAddProject={() => setCurrentScreen(6)}
                />;
      case 6:
        return <AddProjectScreen 
                  addProjectCallback={(newProject) => {
                    addProject(newProject);
                    toast({ title: "Proyecto Añadido", description: `${newProject.nombre} ha sido añadido con éxito.`});
                    setCurrentScreen(5); // Volver a la lista de proyectos
                  }} 
                  toast={toast} 
                  mariaAlonsoData={mariaAlonsoData}
                  onCancel={() => setCurrentScreen(5)}
                />;
      case 7:
        return <TechEvolutionScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  const totalScreens = 7;
  const nextScreen = () => setCurrentScreen(prev => (prev % totalScreens) + 1);
  const prevScreen = () => setCurrentScreen(prev => (prev === 1 ? totalScreens : prev - 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-10">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: currentScreen > (currentScreen-1+totalScreens)%totalScreens ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentScreen < (currentScreen-1+totalScreens)%totalScreens ? 50 : -50 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {renderScreen()}
        </motion.div>

        <div className="flex justify-between items-center mt-12">
          <Button onClick={prevScreen} variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>
          <span className="text-sm text-gray-400">Pantalla {currentScreen} de {totalScreens}</span>
          <Button onClick={nextScreen} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="text-center mt-8">
          <Button onClick={() => navigate('/ecosystem-home')} variant="link" className="text-purple-400 hover:text-purple-300">
            <Home className="w-4 h-4 mr-2" /> Volver al Ecosistema Principal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorSimulationPresentation;