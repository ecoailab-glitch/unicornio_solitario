import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useProjects } from '@/contexts/index';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getAiChatResponse, getAiGuidanceForEmprendedor } from '@/lib/aiService';
import { 
  LogOut, Settings, Bell, UserCheck, Send, Loader2, Maximize, Minimize, X,
  Lightbulb, BarChart3, FileText, MessageSquare, Sparkles, Users, DollarSign, Target, Eye, BookOpen, Brain
} from 'lucide-react';

const EntrepreneurDashboard = () => {
  const { user, logout } = useUser();
  const projectContext = useProjects();
  const projects = projectContext ? projectContext.projects : [];
  const updateProject = projectContext ? projectContext.updateProject : () => {};
  const navigate = useNavigate();
  const { toast } = useToast();

  const [myProject, setMyProject] = useState(null);
  const [showAiChatWindow, setShowAiChatWindow] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  const [isAiChatMaximized, setIsAiChatMaximized] = useState(false);
  const aiChatBodyRef = useRef(null);

  const [purposeIAVisible, setPurposeIAVisible] = useState(false);
  const [purposeIAInput, setPurposeIAInput] = useState('');
  const [purposeIAResponse, setPurposeIAResponse] = useState('');
  const [isPurposeIALoading, setIsPurposeIALoading] = useState(false);


  useEffect(() => {
    if (!user || user.tipo !== 'emprendedor') {
      logout();
      navigate('/');
    } else if (projects) {
      const project = projects.find(p => p.id === user.proyectoId || p.creador === user.nombre);
      setMyProject(project);
      if (!project) {
        toast({ title: "Proyecto no encontrado", description: "No pudimos encontrar tu proyecto asignado.", variant: "destructive"});
      }
    }
  }, [user, projects, navigate, logout, toast]);

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

  const getInitialAiMessage = () => `¡Hola ${user.nombre}! Soy ${user.agenteIAAsignado}, tu asistente IA. ¿Listo para definir tus ventajas diferenciales o necesitas ayuda con tu proyecto ${user.proyectoNombre}?`;

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

  const handlePurposeIASend = async () => {
    if (!purposeIAInput.trim()) return;
    setIsPurposeIALoading(true);
    setPurposeIAResponse('');
    const aiResponse = await getAiGuidanceForEmprendedor(`Ayúdame a definir mi propósito. Mi idea es sobre: ${purposeIAInput}`);
    setPurposeIAResponse(aiResponse.data);
    setIsPurposeIALoading(false);
  };

  const handleSimulateEvolution = () => {
    if (!myProject) return;
    let nextPhase = '';
    let newValoracion = myProject.valorEstimado;

    if (myProject.fase === 'Semilla') {
        nextPhase = 'Pegaso';
        newValoracion = 10000000;
    } else if (myProject.fase === 'Pegaso') {
        nextPhase = 'Dragón';
        newValoracion = 100000000;
    } else if (myProject.fase === 'Dragón') {
        nextPhase = 'Unicornio';
        newValoracion = 1000000000;
    } else {
        toast({ title: "Máxima Evolución", description: "Tu proyecto ya está en la fase Unicornio.", variant: "default"});
        return;
    }
    
    if (updateProject) {
      updateProject(myProject.id, { fase: nextPhase, valorEstimado: newValoracion });
    }
    toast({ title: "¡Simulación Exitosa!", description: `${myProject.nombre} ha evolucionado a fase ${nextPhase} con valoración ${formatCurrency(newValoracion)}.`, duration: 7000});
  };
  
  const requestMentorship = () => {
    toast({ title: "Solicitud Enviada", description: "Hemos notificado a los mentores disponibles. Pronto se pondrán en contacto." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <Lightbulb className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-bold gradient-text">{user.nombre} - {user.proyectoNombre}</h1>
                <p className="text-xs text-purple-300">Emprendedor Visionario</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {myProject ? (
              <Card className="glass-effect">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl text-white">{myProject.nombre}</CardTitle>
                    <Badge className={`${getPhaseColor(myProject.fase)} text-white text-sm`}>{myProject.fase}</Badge>
                  </div>
                  <p className="text-sm text-gray-400">Agente IA: {user.agenteIAAsignado}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{myProject.descripcion}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Valoración Estimada" value={formatCurrency(myProject.valorEstimado)} />
                    <InfoItem label="Financiación Recibida" value={formatCurrency(myProject.financiacionCaptada)} />
                    <InfoItem label="Sector" value={myProject.sector} />
                    <InfoItem label="Región" value={myProject.region} />
                  </div>
                  <div className="border-t border-purple-500/20 pt-4 flex flex-wrap gap-2">
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate(`/proyecto/${myProject.id}`)}><Eye className="w-4 h-4 mr-2"/> Ver Ficha Completa</Button>
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/20" onClick={handleSimulateEvolution}><BarChart3 className="w-4 h-4 mr-2"/> Simular Evolución</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-effect"><CardContent className="p-6 text-center text-gray-400">Cargando tu proyecto...</CardContent></Card>
            )}

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-400"/> Historial y Entregables</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  {myProject?.documentos?.map((doc, i) => <li key={i} className="flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-300"/>{doc}</li>) || <li>No hay documentos.</li>}
                  <li className="italic text-gray-500">Más avances y entregables próximamente...</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          
          <div className="space-y-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-400"/> Tu Guía IA Hoy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-300">"Hoy toca definir tus tres ventajas diferenciales. ¿Quieres que te ayude a escribirlas?"</p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600" onClick={openAiChat}>
                  <MessageSquare className="w-4 h-4 mr-2"/> Chatear con {user.agenteIAAsignado}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Brain className="w-5 h-5 mr-2 text-pink-400"/> Módulo de Propósito Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!purposeIAVisible && <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => setPurposeIAVisible(true)}>Explorar mi Propósito con IA</Button>}
                {purposeIAVisible && (
                  <>
                    <textarea value={purposeIAInput} onChange={(e) => setPurposeIAInput(e.target.value)} placeholder="Describe brevemente tu pasión, idea o problema que quieres resolver..." className="w-full bg-slate-700 border-pink-500/50 text-white resize-none rounded-lg scrollbar-hide text-sm p-2" rows={3} />
                    <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={handlePurposeIASend} disabled={isPurposeIALoading}>
                      {isPurposeIALoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                      Consultar IA de Propósito
                    </Button>
                    {purposeIAResponse && <p className="text-xs text-gray-300 whitespace-pre-wrap p-2 bg-slate-700/50 rounded">{purposeIAResponse}</p>}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-white flex items-center"><Users className="w-5 h-5 mr-2 text-teal-400"/> Mentoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={requestMentorship}>
                  <Users className="w-4 h-4 mr-2"/> Solicitar Mentoría
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
            <h3 className="text-white font-semibold flex items-center"><Sparkles className="w-5 h-5 mr-2 text-purple-400" /> {user.agenteIAAsignado}</h3>
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

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-medium text-white">{value}</p>
  </div>
);

export default EntrepreneurDashboard;