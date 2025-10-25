import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateInstitutionalMessageWithAI } from '@/lib/aiService';

const ActionButtons = ({ user, projectsCount, toast }) => {
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  if (!user || user.tipo !== 'nodo') return null;

  const handleGenerateInstitutionalMessage = async () => {
    setIsGeneratingMessage(true);
    toast({ title: "🤖 IA trabajando...", description: "Generando tu mensaje institucional." });
    const nodeInfo = { nombre: user.nombre, ciudad: user.ciudad, projects: projectsCount };
    const response = await generateInstitutionalMessageWithAI(nodeInfo);
    setIsGeneratingMessage(false);

    if (response.success) {
      navigator.clipboard.writeText(response.data);
      toast({
        title: "¡Mensaje IA Generado!",
        description: "El mensaje institucional se ha copiado al portapapeles.",
        duration: 5000,
      });
    } else {
      toast({ title: "Error IA", description: response.data, variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-8"
    >
      <Button
        onClick={handleGenerateInstitutionalMessage}
        disabled={isGeneratingMessage}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {isGeneratingMessage ? 
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
          <Sparkles className="w-4 h-4 mr-2" />
        }
        Generar Mensaje Institucional (con IA)
      </Button>
    </motion.div>
  );
};

export default ActionButtons;