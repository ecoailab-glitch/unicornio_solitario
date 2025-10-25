import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, UserCheck, ArrowRight } from 'lucide-react';

const MentorWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 hero-pattern opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="relative z-10 text-center glass-effect rounded-3xl p-8 md:p-16 shadow-2xl max-w-3xl mx-auto"
      >
        <div className="flex justify-center items-center space-x-4 md:space-x-6 mb-8">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <img-replace src="/placeholder-impacthub-logo.png" alt="Logo Impact Hub Málaga" className="h-16 md:h-24 metallic-gradient p-2 rounded-md" />
          </motion.div>
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
            <img-replace src="/placeholder-unicornio-solitario-logo.png" alt="Logo Unicornio Solitario" className="h-20 md:h-28 metallic-gradient p-2 rounded-md" />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 gradient-text"
        >
          Bienvenido, José Luis Nieto
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto"
        >
          Este es tu portal exclusivo como Arquitecto y Mentor Principal del Ecosistema Unicornio Solitario.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Button 
            onClick={() => navigate('/mentor-simulation')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg group"
            size="lg"
          >
            <UserCheck className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" />
            Acceder a mi Panel Estratégico
            <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12"
        >
            <Button onClick={() => navigate('/ecosystem-home')} variant="link" className="text-purple-400 hover:text-purple-300">
                O ver la Home Principal del Ecosistema
            </Button>
        </motion.div>

      </motion.div>

      {/* Decorative floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500/20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: Math.random() * 100 - 50 + 'vw', y: Math.random() * 100 - 50 + 'vh' }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: i * 1.5 }}
          style={{
            width: Math.random() * 80 + 20,
            height: Math.random() * 80 + 20,
            left: Math.random() * 80 + '%', // spread out more
            top: Math.random() * 80 + '%', // spread out more
          }}
        />
      ))}
    </div>
  );
};

export default MentorWelcome;