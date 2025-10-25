
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useProjects } from '@/contexts/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getAiChatResponse, generateInstitutionalMessageWithAI } from '@/lib/aiService';
import { 
  LogOut, Settings, Bell, UserCheck, Send, Loader2, Maximize, Minimize, X,
  MapPin, BarChart3, FileText, MessageSquare, Sparkles, Users, DollarSign, Target, Eye, Trophy, PlusCircle
} from 'lucide-react';
import { sdgData } from '@/contexts/ProjectContext/sdgData';
import { Checkbox } from "@/components/ui/checkbox";


const NodeDashboard = () => {
  const { user, logout } = useUser();
  const projectContext = useProjects();
  const projects = projectContext ? projectContext.projects : [];
  const navigate = useNavigate();
  const { toast } = useToast();

  const [nodeProjects, setNodeProjects] = useState([]);
  const [showAiChatWindow, setShowAiChatWindow] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  const [isAiChatMaximized, setIsAiChatMaximized] = useState(false);
  const aiChatBodyRef = useRef(null);

  const [challenges, setChallenges] = useState([
      { id: 1, title: "Reto de Agrotecnología", description: "Innovaciones para un campo más sostenible y productivo.", sdgs: [2, 12, 15] },
      { id: 2, title: "Transición Energética con IA", description: "Uso de IA para optimizar el consumo y la generación de energías limpias.", sdgs: [7, 9, 13] },
  ]);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', sdgs: [] });

  useEffect(() => {
    if (!user || user.tipo !== 'nodo') {
      logout(); 
      navigate('/');
    } else if (projects) {
      const filtered = projects.filter(p => 
        p.region?.toLowerCase().includes('málaga') || 
        p.region?.toLowerCase().includes('andalucía') ||
        p.mentor === user.nombre 
      );
      setNodeProjects(filtered.length > 0 ? filtered : projects.slice(0, 7)); 
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
  
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  };

  const getInitialAiMessage = () => "Soy tu Asistente IA para Nodos. ¿Quieres generar un informe, enviar un mensaje institucional o analizar el rendimiento de tus proyectos?";

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

  const handleGenerateInstitutionalMessage = async () => {
    setIsAiChatLoading(true);
    toast({ title: "🤖 IA trabajando...", description: "Generando tu mensaje institucional." });
    const nodeInfo = { nombre: user.nombre, ciudad: user.ciudad, projects: nodeProjects.length }; 
    const response = await generateInstitutionalMessageWithAI(nodeInfo);
    setIsAiChatLoading(false);

    if (response.success) {
      navigator.clipboard.writeText(response.data);
      toast({
        title: "¡Mensaje IA Generado!",
        description: "El mensaje institucional se ha copiado al portapapeles.",
        duration: 5000,
      });
      if (showAiChatWindow) {
        setAiChatMessages(prev => [...prev, {type: 'ai', text: `Mensaje generado y copiado:\n${response.data}`}]);
      }
    } else {
      toast({ title: "Error IA", description: response.data, variant: "destructive" });
    }
  };
  
  const handleGeneratePDFReport = () => {
    toast({
      title: "Informe PDF (Simulado)",
      description: "Se ha iniciado la generación de tu informe PDF. Estará listo en unos momentos.",
    });
    console.log("Simulating PDF report generation for Node:", user.nombre);
  };

  const handleSdgChange = (sdgId) => {
    setNewChallenge(prev => {
      const newSdgs = prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : [...prev.sdgs, sdgId];
      return { ...prev, sdgs: newSdgs };
    });
  };

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.description) {
        toast({ title: "Error", description: "El título y la descripción son obligatorios.", variant: "destructive" });
        return;
    }
    const challengeToAdd = { ...newChallenge, id: challenges.length + 1 };
    setChallenges(prev => [challengeToAdd, ...prev]);
    setNewChallenge({ title: '', description: '', sdgs: [] });
    toast({ title: "¡Reto Creado!", description: `El reto "${challengeToAdd.title}" ha sido lanzado.` });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img-replace src="/placeholder-impacthub.png" alt="Impact Hub Logo" className="h-10 metallic-gradient p-1 rounded" />
              <div>
                <h1 className="text-xl font-bold gradient-text">{user.nombre}</h1>
                <p className="text-xs text-purple-300">{user.rolAdicional} - {user.ciudad}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => toast({ title: "Notificaciones", description: "No tienes notificaciones nuevas."})}><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/mentor-simulation')} title="Panel Mentor María"><UserCheck className="w-5 h-5" /></Button>
              <Button variant="outline" onClick={logout} size="sm" className="text-xs border-purple-400 text-purple-300 hover:bg-purple-500/20"><LogOut className="w-3 h-3 mr-1" /> Salir</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard title="Proyectos Impulsados" value={user.proyectosImpulsados} icon={Target} color="text-purple-400" />
          <InfoCard title="Inversión Canalizada" value={formatCurrency(user.totalInvertidoCanalizado)} icon={DollarSign} color="text-green-400" />
          <InfoCard title="Beneficio Proyectado" value={formatCurrency(user.beneficioEstimadoProyectado)} icon={BarChart3} color="text-yellow-400" />
          <InfoCard title="Estado del Nodo" value={user.estado} icon={Users} color="text-blue-400" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-white flex items-center"><Trophy className="w-5 h-5 mr-2 text-yellow-400"/> Gestión de Retos</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateChallenge} className="space-y-4 mb-6 p-4 bg-slate-800/50 rounded-lg">
                      <h3 className="font-semibold text-lg text-purple-300">Lanzar Nuevo Reto</h3>
                      <Input value={newChallenge.title} onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})} placeholder="Título del reto (ej. Reto de Agrotecnología)" className="bg-slate-700 border-purple-500/30" />
                      <Textarea value={newChallenge.description} onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})} placeholder="Descripción breve del reto" className="bg-slate-700 border-purple-500/30"/>
                      <div>
                        <p className="text-sm text-gray-300 mb-2">ODS Relacionados (opcional):</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {sdgData.map(sdg => (
                                <div key={sdg.id} className="flex items-center space-x-2 text-xs">
                                    <Checkbox id={`sdg-challenge-${sdg.id}`} onCheckedChange={() => handleSdgChange(sdg.id)} checked={newChallenge.sdgs.includes(sdg.id)} />
                                    <label htmlFor={`sdg-challenge-${sdg.id}`} className="leading-none text-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{sdg.name.split(':')[0]}</label>
                                </div>
                            ))}
                        </div>
                      </div>
                      <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-orange-500"><PlusCircle className="w-4 h-4 mr-2"/> Crear Reto</Button>
                    </form>
                    <h3 className="font-semibold text-lg text-purple-300 mb-4">Retos Activos</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50">
                        {challenges.map(challenge => (
                            <div key={challenge.id} className="bg-slate-800/70 p-3 rounded-lg">
                                <p className="font-bold text-purple-400">{challenge.title}</p>
                                <p className="text-xs text-gray-400">{challenge.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><MapPin className="w-5 h-5 mr-2 text-purple-400"/> Proyectos del Nodo ({nodeProjects.length})</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50">
                {nodeProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nodeProjects.map(p => (
                      <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800/70 p-4 rounded-lg border border-purple-500/30 hover:shadow-purple-500/20 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-md font-semibold text-purple-300">{p.nombre}</h3>
                          <Badge className={`${getPhaseColor(p.fase)} text-white text-xs`}>{p.fase}</Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">Sector: {p.sector}</p>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.descripcion}</p>
                        <Button size="xs" variant="outline" className="text-xs w-full border-purple-400 text-purple-300 hover:bg-purple-500/20" onClick={() => navigate(`/proyecto/${p.id}`)}>
                          <Eye className="w-3 h-3 mr-1" /> Ver Detalles
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No hay proyectos para mostrar.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-400"/> Acciones IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600" onClick={openAiChat}>
                  <MessageSquare className="w-4 h-4 mr-2"/> Chatear con Asistente IA
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500" onClick={handleGenerateInstitutionalMessage} disabled={isAiChatLoading}>
                  {isAiChatLoading && nodeProjects.length === 0 ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2"/>}
                  Mensaje Institucional IA
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><FileText className="w-5 h-5 mr-2 text-green-400"/> Informes</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600" onClick={handleGeneratePDFReport}>
                  <FileText className="w-4 h-4 mr-2"/> Generar Informe PDF
                </Button>
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
            <h3 className="text-white font-semibold flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Asistente IA Nodo</h3>
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
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default NodeDashboard;
