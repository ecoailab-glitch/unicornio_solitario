import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, AlertTriangle, MessageSquare, Send, Video, Loader2, CheckCircle, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { getProjectAlertDetailsAI, getMentorSupportSuggestionAI } from '@/lib/aiService';
import { useProjects } from '@/contexts';
import { getProgressStatusColor, getProgressStatusIcon, formatCurrency } from './utils';

const IntelligentSupportModal = ({ project, isOpen, onClose, updateProject }) => {
  const { toast } = useToast();
  const { recordMentorAction } = useProjects();
  const [activeTab, setActiveTab] = useState('alerts');
  const [alertDetails, setAlertDetails] = useState(null);
  const [mentorInput, setMentorInput] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      fetchAlertDetails();
    } else {
      setAlertDetails(null);
      setMentorInput('');
      setSuggestion(null);
      setActiveTab('alerts');
    }
  }, [isOpen, project]);

  const fetchAlertDetails = async () => {
    if (!project) return;
    setIsLoading(true);
    let alertType = "Información general del proyecto.";
    if (project.progressStatus === 'at_risk') alertType = "Proyecto en riesgo crítico.";
    else if (project.progressStatus === 'needs_attention') alertType = "Proyecto necesita atención.";
    
    const response = await getProjectAlertDetailsAI(project, alertType);
    setAlertDetails(response.data);
    setIsLoading(false);
  };

  const handleGetSuggestion = async () => {
    if (!mentorInput.trim() || !project) return;
    setIsLoading(true);
    const response = await getMentorSupportSuggestionAI(project, mentorInput);
    setSuggestion(response.data);
    setIsLoading(false);
  };

  const handleSendEmail = () => {
    toast({ title: "Correo (simulado) enviado", description: `Se ha enviado un correo al emprendedor de ${project.nombre}.` });
    recordMentorAction(project.id, 'email_sent_ai_suggestion');
    onClose();
  };
  
  const handleRequestVideoCall = () => {
    toast({ title: "Videollamada solicitada", description: `Se ha enviado una solicitud de videollamada para ${project.nombre}.` });
    recordMentorAction(project.id, 'video_call_requested');
  };

  const ProgressIcon = getProgressStatusIcon(project?.progressStatus);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 border border-purple-600 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          <header className="flex items-center justify-between p-4 border-b border-purple-500/30">
            <div className="flex items-center">
              <Zap className="w-6 h-6 mr-2 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Apoyo Inteligente: {project.nombre}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </header>

          <div className="p-2 sm:p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700">
            <div className="flex border-b border-purple-500/30 mb-4">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'alerts' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <AlertTriangle className="w-4 h-4 inline mr-1" /> Alarmas y Predicciones
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'actions' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <MessageSquare className="w-4 h-4 inline mr-1" /> Asesoramiento y Acciones
              </button>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="ml-2 text-gray-300">Consultando IA...</p>
              </div>
            )}

            {!isLoading && activeTab === 'alerts' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className={`p-3 rounded-lg border ${getProgressStatusColor(project.progressStatus, true)} bg-opacity-10`}>
                  <div className="flex items-center mb-1">
                    <ProgressIcon className={`w-5 h-5 mr-2 ${getProgressStatusColor(project.progressStatus)}`} />
                    <h4 className={`text-md font-semibold ${getProgressStatusColor(project.progressStatus)}`}>
                      Estado Actual: {project.progressStatus?.replace('_', ' ')}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    Última financiación: {new Date(project.lastFundingDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-300">
                    Ingresos esperados/actuales: {formatCurrency(project.expectedMonthlyRevenue, true)} / {formatCurrency(project.currentMonthlyRevenue, true)}
                  </p>
                </div>
                
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">Análisis IA:</h4>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">{alertDetails || "Cargando detalles de la alerta..."}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Ratios Estimados (Simulados):</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-700/50 p-2 rounded">
                      <p className="text-gray-400">Valoración Real vs. IA:</p>
                      <p className="text-white font-medium">{Math.random() > 0.5 ? <TrendingUp className="inline w-3 h-3 text-green-400"/> : <TrendingDown className="inline w-3 h-3 text-red-400"/>} {(80 + Math.floor(Math.random() * 40) - 20)}%</p>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <p className="text-gray-400">Avance vs. Sector:</p>
                      <p className="text-white font-medium">{(70 + Math.floor(Math.random() * 60) - 30)}%</p>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <p className="text-gray-400">Participación Emprendedor:</p>
                      <p className="text-white font-medium">{(60 + Math.floor(Math.random() * 80) - 40)}%</p>
                    </div>
                     <div className="bg-slate-700/50 p-2 rounded">
                      <p className="text-gray-400">Interacciones Mentor:</p>
                      <p className="text-white font-medium">{project.mentorInteractions || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!isLoading && activeTab === 'actions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label htmlFor="mentorInput" className="block text-sm font-medium text-purple-300 mb-1">
                    ¿Qué quieres sugerirle a esta persona? (La IA te ayudará a redactar el mensaje)
                  </label>
                  <Textarea
                    id="mentorInput"
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    placeholder="Ej: Que trabaje su historia personal y la convierta en una presentación emocional..."
                    className="bg-slate-700/80 border-purple-500/50 text-white text-sm"
                    rows={3}
                  />
                  <Button onClick={handleGetSuggestion} disabled={!mentorInput.trim()} className="mt-2 text-xs bg-purple-600 hover:bg-purple-700">
                    Obtener Sugerencia IA
                  </Button>
                </div>

                {suggestion && (
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-300 mb-1">Sugerencia de Mensaje IA:</h4>
                    <p className="text-xs text-gray-300 whitespace-pre-wrap">{suggestion}</p>
                    <Button onClick={handleSendEmail} className="mt-3 text-xs bg-green-600 hover:bg-green-700">
                      <Send className="w-3 h-3 mr-1" /> Enviar Correo (Simulado)
                    </Button>
                  </div>
                )}
                
                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Otras Acciones:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleRequestVideoCall} variant="outline" className="text-xs border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                      <Video className="w-3 h-3 mr-1" /> Solicitar Videollamada
                    </Button>
                     <Button 
                        onClick={() => {
                            updateProject(project.id, { progressStatus: 'on_track' });
                            toast({ title: "Estado Actualizado", description: `${project.nombre} marcado como 'En Progreso'.`});
                            recordMentorAction(project.id, 'status_updated_on_track');
                            onClose();
                        }} 
                        variant="outline" 
                        className="text-xs border-green-500/50 text-green-300 hover:bg-green-500/20"
                        disabled={project.progressStatus === 'on_track'}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Marcar como En Progreso
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntelligentSupportModal;