import React from 'react';
import { motion } from 'framer-motion';

const WelcomeSection = ({ user }) => {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold text-white mb-2">
        ¡Bienvenido, {user.nombre}! 👋
      </h2>
      <p className="text-gray-300">
        Explora el ecosistema y conecta con proyectos innovadores.
      </p>
    </motion.div>
  );
};

export default WelcomeSection;