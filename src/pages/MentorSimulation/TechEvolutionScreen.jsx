import React, { useState } from 'react';
import SectionCard from './SectionCard';
import { BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fasesEvolucionData, mareNostrumInfo, dondeEstasTuInfo } from './constants';
import { Button } from '@/components/ui/button'; 

const InfoSection = ({ data }) => {
  const Icon = data.icon;
  return (
    <SectionCard title="" cardClassName="bg-slate-800/60 border border-purple-700/50" contentClassName="p-4 md:p-6">
      <div className="flex items-start">
        <Icon className="w-8 h-8 mr-4 text-purple-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-purple-300 mb-2">{data.titulo}</h3>
          <p className="text-gray-300 mb-3 text-sm md:text-base">{data.descripcion}</p>
          {data.puntosClave && (
            <ul className="list-disc list-inside space-y-1 mb-3 text-gray-400 text-xs md:text-sm">
              {data.puntosClave.map((punto, i) => (
                <li key={i}>{punto}</li>
              ))}
            </ul>
          )}
          <p className="italic text-purple-400 opacity-90 text-sm md:text-base">{data.cita}</p>
        </div>
      </div>
    </SectionCard>
  );
};

const TechEvolutionScreen = () => {
  const [selectedPhase, setSelectedPhase] = useState(fasesEvolucionData[0]);

  const phaseButtonStyles = {
    '🌱 Fase Semilla': {
      bgColor: 'bg-emerald-500',
      hoverBgColor: 'hover:bg-emerald-600',
      textColor: 'text-white',
      mainText: 'Semilla',
      subText: 'Ideas iniciales con potencial'
    },
    '🟦 Fase Pegaso': {
      bgColor: 'bg-blue-500',
      hoverBgColor: 'hover:bg-blue-600',
      textColor: 'text-white',
      mainText: 'Pegaso',
      subText: 'Proyectos en crecimiento'
    },
    '🟧 Fase Dragón': {
      bgColor: 'bg-orange-500',
      hoverBgColor: 'hover:bg-orange-600',
      textColor: 'text-white',
      mainText: 'Dragón',
      subText: 'Startups escalables'
    },
    '🟪 Fase Unicornio': {
      bgColor: 'bg-purple-600',
      hoverBgColor: 'hover:bg-purple-700',
      textColor: 'text-white',
      mainText: 'Unicornio',
      subText: 'Empresas valoradas en +$1B'
    },
  };

  return (
    <SectionCard title="🧭 El Viaje Evolutivo del Unicornio Solitario" icon={BarChart2} delay={0} cardClassName="bg-transparent shadow-none border-none" contentClassName="p-0">
      <p className="text-center text-gray-400 mb-8 text-sm md:text-base">Desde la semilla hasta la superautomatización algorítmica. Selecciona una fase para ver más detalles.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {fasesEvolucionData.map(phase => {
          const style = phaseButtonStyles[phase.fase] || { bgColor: 'bg-gray-500', hoverBgColor: 'hover:bg-gray-600', textColor: 'text-white', mainText: 'Fase', subText: 'Descripción' };
          return (
            <Button
              key={phase.fase}
              onClick={() => setSelectedPhase(phase)}
              variant="default"
              className={`w-full h-32 md:h-36 text-center font-semibold rounded-2xl shadow-xl flex flex-col justify-center items-center p-3 transition-all duration-300 ease-in-out transform hover:scale-105
                ${style.bgColor} ${style.hoverBgColor} ${style.textColor}
                ${selectedPhase.fase === phase.fase ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-pink-500 scale-105' : 'opacity-90 hover:opacity-100'}
              `}
            >
              <span className="block text-xl md:text-2xl font-bold">{style.mainText}</span>
              <span className="block text-xs md:text-sm opacity-90 mt-1 leading-tight">{style.subText}</span>
            </Button>
          );
        })}
      </div>

      {selectedPhase && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase.fase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`p-4 md:p-6 rounded-xl shadow-xl mb-8 md:mb-12 ${selectedPhase.colorClasses} bg-opacity-30`}
          >
            <div className="flex items-center mb-4">
              <selectedPhase.icon className={`w-8 h-8 md:w-10 md:h-10 mr-4 ${selectedPhase.textColor}`} />
              <div>
                <h3 className={`text-2xl md:text-3xl font-bold ${selectedPhase.textColor}`}>{selectedPhase.fase}</h3>
                <p className="text-sm text-gray-300">{selectedPhase.subtitulo}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base leading-relaxed">{selectedPhase.descripcion}</p>
            <ul className="list-disc list-inside space-y-1.5 mb-4 text-gray-400 text-xs md:text-sm">
              {selectedPhase.puntosClave.map((punto, i) => (
                <li key={i}>{punto}</li>
              ))}
            </ul>
            <p className={`italic ${selectedPhase.textColor} opacity-90 text-sm md:text-base`}>{selectedPhase.cita}</p>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="space-y-6 md:space-y-8">
        <InfoSection data={mareNostrumInfo} />
        <InfoSection data={dondeEstasTuInfo} />
      </div>
    </SectionCard>
  );
};

export default TechEvolutionScreen;