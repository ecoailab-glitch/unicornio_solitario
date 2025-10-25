import React from 'react';
import SectionCard from './SectionCard';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { simulacionAltoImpactoData, totalPosibleAltoImpacto } from './constants';

const HighImpactSimulationScreen = () => {
  return (
    <SectionCard title="Simulación de Alto Impacto (Proyección hasta 2030)" icon={DollarSign} delay={0.3}>
      <div className="space-y-4 p-4">
        {simulacionAltoImpactoData.map(item => (
          <div key={item.concepto} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
            <p className="text-gray-300">{item.concepto}:</p>
            <p className="text-lg font-semibold text-purple-300">{item.proyeccion}</p>
          </div>
        ))}
        <div className="flex justify-between items-center p-3 bg-purple-600/30 rounded-lg mt-4">
          <p className="text-xl font-bold text-white">TOTAL POSIBLE:</p>
          <p className="text-2xl font-bold text-green-300">{totalPosibleAltoImpacto}</p>
        </div>
        <div className="text-center mt-6">
          <Button variant="outline" className="border-purple-500/50 text-purple-300">Ver desglose por fase</Button>
        </div>
      </div>
    </SectionCard>
  );
};

export default HighImpactSimulationScreen;