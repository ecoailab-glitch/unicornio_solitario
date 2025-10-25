import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAiChatResponse } from '@/lib/aiService';
import { Sparkles, Send, Loader2, Maximize, Minimize, X } from 'lucide-react';

const AiChatWindow = ({ user, setShowAiChatWindow }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const bodyRef = useRef(null);

  const getInitialAiMessage = (userType) => {
    const initialMessages = {
      nodo: "Soy tu Asistente IA para Nodos. ¿Cómo puedo ayudarte a gestionar tus proyectos o estrategias hoy?",
      emprendedor: "¡Hola Emprendedor! Soy tu IA Unicornio. ¿Tienes dudas sobre tu propósito, ideas de negocio o próximos pasos?",
      mentor: "Saludos Mentor. Estoy aquí para ayudarte a encontrar proyectos, analizar su potencial o preparar feedback.",
      inversor: "Bienvenido Inversor. Puedo proporcionarte análisis de proyectos en fase Dragón o Unicornio, o filtrar oportunidades."
    };
    return initialMessages[userType] || "Hola, soy tu Asistente IA Unicornio. ¿En qué puedo ayudarte?";
  };
  
  useEffect(() => {
    setMessages([{ type: 'ai', text: getInitialAiMessage(user?.tipo) }]);
  }, [user?.tipo]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAiChatResponse(userMessage.text, user.tipo);
    setMessages(prev => [...prev, { type: 'ai', text: aiResponse.data }]);
    setIsLoading(false);
  };
  
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-0 right-0 mb-4 mr-4 glass-effect rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col
        ${isMaximized ? 'w-[calc(100%-2rem)] h-[calc(100%-8rem)] sm:w-2/3 lg:w-1/2 xl:w-2/5' : 'w-full max-w-md sm:w-96 h-[500px]'}`}
      style={{ zIndex: 1000 }}
    >
      <div className="bg-slate-800/80 p-3 flex items-center justify-between cursor-move">
        <h3 className="text-white font-semibold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" /> Asistente IA Unicornio
        </h3>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMaximized(!isMaximized)} className="text-gray-400 hover:text-white">
            {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowAiChatWindow(false)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div ref={bodyRef} className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-slate-700 text-gray-200 flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Pensando...
            </div>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-purple-500/30 bg-slate-800/80">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-slate-700 border-purple-500/50 text-white resize-none rounded-lg scrollbar-hide text-sm"
            rows={1}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AiChatWindow;