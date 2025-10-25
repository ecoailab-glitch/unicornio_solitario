
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjects, useUser } from '@/contexts/index';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Bell, Briefcase, DollarSign, Filter, PlusCircle, Settings, TrendingUp, UserCircle, X, Zap, User, MessageSquare, Send, Video, Activity, ListChecks, Edit, Loader2 } from 'lucide-react';
import { mariaAlonsoData as joseLuisNietoData, initialProjects } from './MentorSimulation/constants';
import { formatCurrency, getPhaseColor, getProgressStatusColor, getProgressStatusIcon } from './MentorSimulation/utils';
import SectionCard from './MentorSimulation/SectionCard';

const IntelligentSupportModal = lazy(() => import('./MentorSimulation/IntelligentSupportModal'));
const MentorPreferencesModal = lazy(() => import('./MentorSimulation/MentorPreferencesModal'));
const MentorStatisticsModal = lazy(() => import('./MentorSimulation/MentorStatisticsModal'));


const MentorSimulationDashboard = () => {
  const navigate = useNavigate();
  const projectContext = useProjects();
  const { toast } = useToast();
  
  const [mentorProjects, setMentorProjects] = useState([]);
  const [filteredMentorProjects, setFilteredMentorProjects] = useState([]);
  const [selectedProjectForSupport, setSelectedProjectForSupport] = useState(null);
  
  const [projectFilters, setProjectFilters] = useState({ fase: 'todas', status: 'todos' });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [mentorPreferences, setMentorPreferences] = useState({
    receiveEmailAlerts: true,
    receivePushAlerts: false,
    alertFrequency: 'daily',
    highlightSectors: ['IA', 'Sostenibilidad'],
  });

  const projects = projectContext ? projectContext.projects : [];
  const addProject = projectContext ? projectContext.addProject : () => {};
  const updateProject = projectContext ? projectContext.updateProject : () => {};


  useEffect(() => {
    if (!projectContext) return; 

    const JLNProjects = projects.filter(p => p.mentor === joseLuisNietoData.nombreCompleto);
    if (JLNProjects.length === 0 && projects.length > 0) {
        initialProjects.forEach(p => {
            if (p.mentor === joseLuisNietoData.nombreCompleto) {
                const existing = projects.find(ep => ep.nombre === p.nombre && ep.mentor === p.mentor);
                if(!existing && addProject) addProject(p);
            }
        });
    }
    setMentorProjects(projects.filter(p => p.mentor === joseLuisNietoData.nombreCompleto));
  }, [projects, addProject, projectContext]);

  useEffect(() => {
    let tempProjects = [...mentorProjects];
    if (projectFilters.fase !== 'todas') {
      tempProjects = tempProjects.filter(p => p.fase === projectFilters.fase);
    }
    if (projectFilters.status !== 'todos') {
      tempProjects = tempProjects.filter(p => p.progressStatus === projectFilters.status);
    }
    setFilteredMentorProjects(tempProjects);
  }, [mentorProjects, projectFilters]);

  if (!projectContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
        <p className="ml-4 text-xl text-white">Cargando Proyectos...</p>
      </div>
    );
  }


  const totalPortfolioValue = mentorProjects.reduce((sum, p) => sum + (p.valorEstimado || 0), 0);
  const totalMentorBenefit = mentorProjects.reduce((sum, p) => sum + (p.beneficioEstimadoMentor || 0), 0);

  const openIntelligentSupport = (project) => {
    setSelectedProjectForSupport(project);
  };

  const closeIntelligentSupport = () => {
    setSelectedProjectForSupport(null);
  };
  
  const StatCard = ({ title, value, icon, color = "text-purple-400", onClick }) => {
    const IconComponent = icon;
    return (
      <SectionCard title="" delay={0.1} className={`cursor-pointer hover:border-purple-400/70 transition-all ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <div className="p-1">
          <div className="flex items-center mb-1">
            <IconComponent className={`w-5 h-5 mr-2 ${color}`} />
            <h3 className="text-sm text-gray-400">{title}</h3>
          </div>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </SectionCard>
    );
  };

  const ProjectCard = ({ project }) => {
    const ProgressIcon = getProgressStatusIcon(project.progressStatus);
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="glass-effect rounded-lg p-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-md font-semibold text-purple-300">{project.nombre}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getPhaseColor(project.fase)}`}>{project.fase}</span>
          </div>
          <p className="text-xs text-gray-400 mb-1 line-clamp-2">{project.descripcion}</p>
          <div className="text-xs space-y-1 my-2">
            <p>Financiación: <span className="font-medium">{formatCurrency(project.financiacionCaptada, true)}</span></p>
            <p>Beneficio Mentor: <span className="font-medium text-green-400">{formatCurrency(project.beneficioEstimadoMentor, true)}</span></p>
            <div className="flex items-center">
              <ProgressIcon className={`w-3 h-3 mr-1 ${getProgressStatusColor(project.progressStatus)}`} />
              <span className={`capitalize ${getProgressStatusColor(project.progressStatus)}`}>{project.progressStatus?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex space-x-2">
          <Button size="sm" variant="outline" className="text-xs flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10" onClick={() => navigate(`/proyecto/${project.id}`)}>Detalles</Button>
          <Button size="sm" className="text-xs flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => openIntelligentSupport(project)}>
            <Zap className="w-3 h-3 mr-1" /> Apoyo IA
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 text-white p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img-replace src="/placeholder-impacthub.png" alt="Menttoriza Logo" className="h-10 mr-3 metallic-gradient p-1 rounded" />
          <h1 className="text-xl md:text-2xl font-bold gradient-text">Panel de Mentor: {joseLuisNietoData.nombreCompleto}</h1>
        </div>
        <div className="flex items-center space-x-1 md:space-x-3">
           <Button variant="ghost" size="icon" onClick={() => navigate('/ecosystem-home')} className="text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowPreferencesModal(true)} className="text-gray-300 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowStatisticsModal(true)} className="text-gray-300 hover:text-white">
            <Activity className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SectionCard title="Perfil Profesional" icon={UserCircle} delay={0}>
            <div className="text-sm space-y-1 p-2">
              <p><strong>Nodo:</strong> {joseLuisNietoData.nodo}</p>
              <p><strong>Ranking Global:</strong> {joseLuisNietoData.rankingMentorRegional}</p>
              <p><strong>Incorporación:</strong> {joseLuisNietoData.incorporacion}</p>
            </div>
          </SectionCard>

          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Proyectos Activos" value={mentorProjects.length} icon={Briefcase} />
            <StatCard title="Valor Portfolio" value={formatCurrency(totalPortfolioValue, true)} icon={DollarSign} color="text-green-400" />
            <StatCard title="Beneficio Estimado" value={formatCurrency(totalMentorBenefit, true)} icon={TrendingUp} color="text-green-400" />
            <StatCard title="Alertas IA" value={mentorProjects.filter(p => p.progressStatus === 'at_risk' || p.progressStatus === 'needs_attention').length} icon={Bell} color="text-red-400" onClick={() => setProjectFilters(prev => ({...prev, status: 'at_risk'}))}/>
          </div>
          
          <SectionCard title="Añadir Proyecto / Invitar" icon={PlusCircle} delay={0.2}>
             <AddProjectForm addProjectCallback={addProject} toast={toast} mentorData={joseLuisNietoData} />
          </SectionCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Mis Proyectos" icon={Briefcase} delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-2 mb-4 p-2">
              <select 
                value={projectFilters.fase} 
                onChange={(e) => setProjectFilters(prev => ({...prev, fase: e.target.value}))}
                className="flex-1 bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="todas">Todas las Fases</option>
                <option value="Semilla">Semilla</option>
                <option value="Pegaso">Pegaso</option>
                <option value="Dragón">Dragón</option>
                <option value="Unicornio">Unicornio</option>
              </select>
              <select 
                value={projectFilters.status} 
                onChange={(e) => setProjectFilters(prev => ({...prev, status: e.target.value}))}
                className="flex-1 bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="todas">Todos los Estados</option>
                <option value="on_track">En Progreso</option>
                <option value="needs_attention">Necesita Atención</option>
                <option value="at_risk">En Riesgo</option>
                <option value="exceeding_expectations">Superando Expectativas</option>
              </select>
              <Button variant="ghost" onClick={() => setProjectFilters({ fase: 'todas', status: 'todos' })} className="text-purple-300 text-sm hover:bg-purple-500/10">
                <Filter className="w-4 h-4 mr-1" /> Limpiar
              </Button>
            </div>
            {filteredMentorProjects.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50">
                <AnimatePresence>
                  {filteredMentorProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                </AnimatePresence>
              </motion.div>
            ) : (
              <p className="text-center text-gray-400 py-8">No hay proyectos que coincidan con los filtros.</p>
            )}
          </SectionCard>
        </div>
      </main>
      
      <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"><p className="text-white">Cargando Módulo...</p></div>}>
        {selectedProjectForSupport && (
          <IntelligentSupportModal
            project={selectedProjectForSupport}
            isOpen={!!selectedProjectForSupport}
            onClose={closeIntelligentSupport}
            updateProject={updateProject}
          />
        )}
        {showPreferencesModal && (
          <MentorPreferencesModal
            isOpen={showPreferencesModal}
            onClose={() => setShowPreferencesModal(false)}
            preferences={mentorPreferences}
            onSave={(newPrefs) => {
              setMentorPreferences(newPrefs);
              toast({ title: "Preferencias Guardadas", description: "Tus ajustes de notificación y seguimiento han sido actualizados."});
              setShowPreferencesModal(false);
            }}
          />
        )}
        {showStatisticsModal && (
          <MentorStatisticsModal
            isOpen={showStatisticsModal}
            onClose={() => setShowStatisticsModal(false)}
            projects={mentorProjects}
          />
        )}
      </Suspense>
    </div>
  );
};


const AddProjectForm = ({ addProjectCallback, toast, mentorData }) => {
  const [form, setForm] = useState({ nombre: '', email: '', sector: '', idea: '', mensajePersonalizado: '' });

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.sector) {
      toast({ title: "Error", description: "Completa nombre, email y sector.", variant: "destructive" });
      return;
    }
    const newProjectData = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: form.nombre,
      creador: form.nombre, 
      fase: 'Semilla',
      sector: form.sector,
      region: mentorData.nodo.split(' ').pop() || 'Málaga', 
      descripcion: form.idea || `Nuevo proyecto de ${form.nombre} en ${form.sector}.`,
      ia: 'Agente IA por asignar',
      agentes: [],
      mentor: mentorData.nombreCompleto,
      impacto: 'Por definir',
      documentos: ['Brief inicial'],
      financiacionCaptada: 0,
      valorEstimado: 50000, 
      beneficioEstimadoMentor: 1000,
      lastFundingDate: new Date().toISOString(),
      expectedMonthlyRevenue: 0,
      currentMonthlyRevenue: 0,
      progressStatus: 'on_track',
      mentorInteractions: 0,
      deliveriesCompleted: 0,
    };
    if (addProjectCallback) {
        addProjectCallback(newProjectData);
    }
    toast({ title: "¡Invitación Enviada!", description: `Se ha invitado a ${form.nombre} (${form.email}) al ecosistema.` });
    
    if(form.mensajePersonalizado){
        console.log("Mensaje personalizado para WhatsApp/Email:", form.mensajePersonalizado);
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(form.mensajePersonalizado + ` Únete aquí: ${window.location.origin}/registro/emprendedor`)}`;
        window.open(whatsappLink, '_blank');
    }

    setForm({ nombre: '', email: '', sector: '', idea: '', mensajePersonalizado: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-2">
      <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre Emprendedor/Proyecto" className="w-full bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500" required />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email del Emprendedor" className="w-full bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500" required />
      <input type="text" name="sector" value={form.sector} onChange={handleChange} placeholder="Sector del Proyecto" className="w-full bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500" required />
      <textarea name="idea" value={form.idea} onChange={handleChange} placeholder="Breve descripción de la idea (opcional)" rows="2" className="w-full bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"></textarea>
      <textarea name="mensajePersonalizado" value={form.mensajePersonalizado} onChange={handleChange} placeholder="Mensaje personalizado para enviar (opcional)" rows="2" className="w-full bg-slate-800/70 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"></textarea>
      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm hover:opacity-90 transition-opacity">
        <User className="w-4 h-4 mr-2"/> Invitar Emprendedor
      </Button>
    </form>
  );
};

export default MentorSimulationDashboard;
