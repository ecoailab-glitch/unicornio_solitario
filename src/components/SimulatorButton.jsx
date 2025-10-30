import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SimulatorButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/simulador'); // Ruta original
  };

  return (
    <section className="simulator-section py-16 px-4 text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          ¿Listo para empezar tu viaje?
        </h2>
        <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto">
          Descubre el potencial de tu startup y simula su trayectoria hacia convertirse en un unicornio.
        </p>
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🦄 Simular mi Unicornio
        </button>
      </div>
    </section>
  );
};