import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle } from 'lucide-react';

const getInitialAiMessage = (userType) => {
  const messages = {
    nodo: "¿Quieres compartir los avances de tus proyectos o analizar oportunidades?",
    emprendedor: "Tu propósito podría alinearse con estas ideas. ¿Quieres verlas?",
    mentor: "Hay proyectos esperando tu experiencia. ¿Necesitas un resumen?",
    inversor: "Proyectos en Fase Dragón buscan inversión. ¿Análisis detallado?",
  };
  return messages[userType] || "¿En qué puedo ayudarte hoy?";
};

const AiAssistantSection = ({ user, setShowAiChatWindow }) => {
  if (!user) return null;

  const openAiChat = () => {
    setShowAiChatWindow(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-8"
    >
      <div className="glass-effect rounded-2xl p-6 border border-purple-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Asistente IA Unicornio</h3>
              <p className="text-sm text-gray-300">{getInitialAiMessage(user.tipo)}</p>
            </div>
          </div>
          <Button
            onClick={openAiChat}
            className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto shrink-0"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chatear con IA
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AiAssistantSection;