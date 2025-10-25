import React from 'react';
import SectionCard from './SectionCard';
import { TrendingUp } from 'lucide-react';
import { simulacionAnualData, totalAcumulado5Anos } from './constants';
import { formatCurrency } from './utils';

const AnnualSimulationScreen = () => {
  return (
    <SectionCard title="Simulación de Crecimiento (2025–2029)" icon={TrendingUp} delay={0.2}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-3 px-2">Año</th>
              <th className="text-left py-3 px-2">Proyectos Activos</th>
              <th className="text-right py-3 px-2">Financiación Movida</th>
              <th className="text-right py-3 px-2">Beneficio Total Simulado</th>
            </tr>
          </thead>
          <tbody>
            {simulacionAnualData.map(item => (
              <tr key={item.year} className="border-b border-slate-700 hover:bg-slate-800/30">
                <td className="py-3 px-2 font-semibold">{item.year}</td>
                <td className="py-3 px-2">{item.proyectos}</td>
                <td className="text-right py-3 px-2">{formatCurrency(item.financiacionMovida)}</td>
                <td className="text-right py-3 px-2 text-green-400 font-medium">{formatCurrency(item.beneficioTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold text-lg">
              <td colSpan="3" className="py-4 px-2">Total acumulado en 5 años (modelo conservador):</td>
              <td className="text-right py-4 px-2 text-green-300">{formatCurrency(totalAcumulado5Anos)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </SectionCard>
  );
};

export default AnnualSimulationScreen;