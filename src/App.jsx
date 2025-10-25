
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { ProjectProvider } from '@/contexts/index';

const Home = lazy(() => import('@/pages/Home'));

const NodeDashboard = lazy(() => import('@/pages/RoleDashboards/NodeDashboard'));
const EntrepreneurDashboard = lazy(() => import('@/pages/RoleDashboards/EntrepreneurDashboard'));
const MentorDashboard = lazy(() => import('@/pages/RoleDashboards/MentorDashboard'));
const InvestorDashboard = lazy(() => import('@/pages/RoleDashboards/InvestorDashboard'));
const CorporateDashboard = lazy(() => import('@/pages/RoleDashboards/CorporateDashboard'));
const SocialProjectDashboard = lazy(() => import('@/pages/RoleDashboards/SocialProjectDashboard'));

const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const InstitutionalMetrics = lazy(() => import('@/pages/InstitutionalMetrics'));
const Simulator = lazy(() => import('@/pages/Simulator'));

const MentorSimulation = lazy(() => import('@/pages/MentorSimulation')); 

const MentorWelcome = lazy(() => import('@/pages/MentorWelcome'));
const AiInfrastructure = lazy(() => import('@/pages/AiInfrastructure.jsx'));

const Registration = lazy(() => import('@/pages/Registration'));
const NewProjectForm = lazy(() => import('@/pages/NewProjectForm'));
const FunnelDashboard = lazy(() => import('@/pages/FunnelDashboard'));


const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="animate-pulse text-4xl font-bold gradient-text">Cargando Ecosistema...</div>
  </div>
);


function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/bienvenida-mentor" element={<MentorWelcome />} />
                <Route path="/ecosystem-home" element={<Home />} />
                
                <Route path="/dashboard/nodo" element={<NodeDashboard />} />
                <Route path="/dashboard/emprendedor" element={<EntrepreneurDashboard />} />
                <Route path="/dashboard/mentor" element={<MentorDashboard />} />
                <Route path="/dashboard/inversor" element={<InvestorDashboard />} />
                <Route path="/dashboard/gran_empresa" element={<CorporateDashboard />} />
                <Route path="/dashboard/proyecto_social" element={<SocialProjectDashboard />} />
                
                <Route path="/proyecto/nuevo" element={<NewProjectForm />} />
                <Route path="/proyecto/:id" element={<ProjectDetail />} />
                <Route path="/metricas" element={<InstitutionalMetrics />} />
                <Route path="/funnel" element={<FunnelDashboard />} />
                <Route path="/simulador" element={<Simulator />} />
                
                <Route path="/mentor-simulation" element={<MentorSimulation />} /> 
                <Route path="/infraestructura-ia" element={<AiInfrastructure />} />
                <Route path="/registro/:tipo" element={<Registration />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </ProjectProvider>
    </UserProvider>
  );
}

export default App;
