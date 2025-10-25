import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useProjects } from '@/contexts/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getAiChatResponse } from '@/lib/aiService';
import { 
  LogOut, Settings, Bell, UserCheck, Send, Loader2, Maximize, Minimize, X,
  Users, BarChart3, MessageSquare, Sparkles, Eye, CheckCircle, ListFilter
} from 'lucide-react';

const MentorDashboard = () => {
  const { user, logout } = useUser();
  const projectContext = useProjects();
  const projects = projectContext ? projectContext.projects : [];
  const updateProject = projectContext ? projectContext.updateProject : () => {};
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assignedProjects, setAssignedProjects] = useState([]);
  const [showAiChatWindow, setShowAiChatWindow] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  const [isAiChatMaximized, setIsAiChatMaximized] = useState(false);
  const aiChatBodyRef = useRef(null);
  const [filter, setFilter] = useState('todos');


  useEffect(() => {
    if (!user || user.tipo !== 'mentor') {
      logout();
      navigate('/');
    } else if (projects) {
      const mentorProjs = projects.filter(p => user.proyectosAsignadosIds?.includes(p.id));
      setAssignedProjects(mentorProjs);
    }
  }, [user, projects, navigate, logout]);

  useEffect(() => {
    if (aiChatBodyRef.current) {
      aiChatBodyRef.current.scrollTop = aiChatBodyRef.current.scrollHeight;
    }
  }, [aiChatMessages]);

  if (!user || !projectContext) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
    </div>
  );


  const getPhaseColor = (fase) => {
    const colors = {
      'Semilla': 'bg-green-500',
      'Pegaso': 'bg-blue-500',
      'Dragón': 'bg-orange-500',
      'Unicornio': 'bg-purple-600'
    };
    return colors[fase] || 'bg-gray-500';
  };
  
  const getInitialAiMessage = () => `Hola ${user.nombre}. Tienes ${assignedProjects.length} proyectos asignados. ¿Necesitas un resumen, preparar feedback o buscar otros perfiles?`;

  const openAiChat = () => {
    if (aiChatMessages.length === 0) {
      setAiChatMessages([{ type: 'ai', text: getInitialAiMessage() }]);
    }
    setShowAiChatWindow(true);
  };

  const handleAiChatSend = async () => {
    if (!aiChatInput.trim()) return;
    const newMessage = { type: 'user', text: aiChatInput };
    setAiChatMessages(prev => [...prev, newMessage]);
    setAiChatInput('');
    setIsAiChatLoading(true);

    const aiResponse = await getAiChatResponse(newMessage.text, user.tipo);
    setAiChatMessages(prev => [...prev, { type: 'ai', text: aiResponse.data }]);
    setIsAiChatLoading(false);
  };

  const markMentorshipCompleted = (projectId) => {
    if (updateProject) {
      const projectToUpdate = projects.find(p=>p.id === projectId);
      updateProject(projectId, { mentorInteractions: (projectToUpdate?.mentorInteractions || 0) + 1 });
    }
    toast({ title: "Mentoría Completada", description: `Has marcado la mentoría para el proyecto como completada.` });
  };

  const filteredAssignedProjects = assignedProjects.filter(p => {
    if (filter === 'todos') return true;
    return p.fase.toLowerCase() === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <Users className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-xl font-bold gradient-text">{user.nombre}</h1>
                <p className="text-xs text-purple-300">{user.rolAdicional}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => toast({ title: "Notificaciones", description: "No tienes notificaciones nuevas."})}><Bell className="w-5 h-5" /></Button>
              <Button variant="outline" onClick={logout} size="sm" className="text-xs border-purple-400 text-purple-300 hover:bg-purple-500/20"><LogOut className="w-3 h-3 mr-1" /> Salir</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard title="Proyectos Asignados" value={assignedProjects.length} icon={UserCheck} color="text-green-400" />
          <InfoCard title="Sectores Activos" value={user.sectoresActivos?.join(', ') || 'N/A'} icon={ListFilter} color="text-blue-400" />
          <InfoCard title="Feedback Recibido" value={user.feedbackRecibido} icon={Sparkles} color="text-yellow-400" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-effect h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center"><Users className="w-5 h-5 mr-2 text-green-400"/> Proyectos Asignados</CardTitle>
                <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-slate-800/70 border border-purple-500/30 rounded-md px-2 py-1 text-xs text-gray-300 focus:ring-purple-500 focus:border-purple-500">
                  <option value="todos">Todas las fases</option>
                  <option value="semilla">Semilla</option>
                  <option value="pegaso">Pegaso</option>
                  <option value="dragón">Dragón</option>
                  <option value="unicornio">Unicornio</option>
                </select>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50">
                {filteredAssignedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAssignedProjects.map(p => (
                      <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800/70 p-4 rounded-lg border border-purple-500/30 hover:shadow-purple-500/20 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                          <h3 className="text-md font-semibold text-purple-300">{p.nombre}</h3>
                          <Badge className={`${getPhaseColor(p.fase)} text-white text-xs`}>{p.fase}</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">Emprendedor: {p.creador}</p>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">IA Sugerencia Próxima Mentoría: "Revisar KPIs de adquisición de usuarios y estrategia de marketing de contenidos." (Simulado)</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="xs" variant="outline" className="text-xs border-purple-400 text-purple-300 hover:bg-purple-500/20" onClick={() => navigate(`/proyecto/${p.id}`)}>
                            <Eye className="w-3 h-3 mr-1" /> Ver Detalles
                          </Button>
                           <Button size="xs" variant="outline" className="text-xs border-blue-400 text-blue-300 hover:bg-blue-500/20" onClick={() => toast({title: "Contacto", description:`Contactando a ${p.creador}... (Simulado)`})}>
                            <MessageSquare className="w-3 h-3 mr-1" /> Contactar
                          </Button>
                          <Button size="xs" className="text-xs bg-green-600 hover:bg-green-700" onClick={() => markMentorshipCompleted(p.id)}>
                            <CheckCircle className="w-3 h-3 mr-1" /> Marcar Completada
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No hay proyectos asignados que coincidan con el filtro.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-400"/> Asistente IA Mentor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <p className="text-sm text-gray-300">"Tienes {filteredAssignedProjects.length} proyectos activos. ¿Necesitas ideas para tu próxima sesión de mentoría o un análisis de progreso?"</p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600" onClick={openAiChat}>
                  <MessageSquare className="w-4 h-4 mr-2"/> Chatear con IA
                </Button>
              </CardContent>
            </Card>
             <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-blue-400"/> Dashboard Evolución</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 text-center py-4">Gráficos de evolución de proyectos próximamente.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showAiChatWindow && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-0 right-0 mb-4 mr-4 glass-effect rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col
            ${isAiChatMaximized ? 'w-[calc(100%-2rem)] h-[calc(100%-8rem)] sm:w-2/3 lg:w-1/2' : 'w-full max-w-md sm:w-96 h-[500px]'}`}
          style={{ zIndex: 1000 }}
        >
          <div className="bg-slate-800/80 p-3 flex items-center justify-between cursor-move">
            <h3 className="text-white font-semibold flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Asistente IA Mentor</h3>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setIsAiChatMaximized(!isAiChatMaximized)} className="text-gray-400 hover:text-white"><Maximize className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setShowAiChatWindow(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></Button>
            </div>
          </div>
          <div ref={aiChatBodyRef} className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700">
            {aiChatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiChatLoading && (
              <div className="flex justify-start"><div className="max-w-[80%] p-3 rounded-lg bg-slate-700 text-gray-200 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Pensando...</div></div>
            )}
          </div>
          <div className="p-3 border-t border-purple-500/30 bg-slate-800/80">
            <div className="flex items-center space-x-2">
              <textarea value={aiChatInput} onChange={(e) => setAiChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiChatSend())} placeholder="Escribe tu mensaje..." className="flex-1 bg-slate-700 border-purple-500/50 text-white resize-none rounded-lg scrollbar-hide text-sm p-2" rows={1} disabled={isAiChatLoading} />
              <Button onClick={handleAiChatSend} disabled={isAiChatLoading || !aiChatInput.trim()} className="bg-purple-600 hover:bg-purple-700"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const InfoCard = ({ title, value, icon: Icon, color }) => (
  <Card className="glass-effect-light border-purple-500/20">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <Icon className={`w-7 h-7 ${color || 'text-purple-400'}`} />
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-md font-semibold text-white">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MentorDashboard;