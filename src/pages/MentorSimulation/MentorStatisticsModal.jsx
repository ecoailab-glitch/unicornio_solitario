import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, BarChart2, Users, Target, TrendingUp, Award, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from './utils'; 
import { simulacionAnualData, totalAcumulado5Anos, simulacionAltoImpactoData } from './constants';


const StatItem = ({ icon: Icon, label, value, color = "text-purple-300" }) => (
  <div className="flex items-start p-3 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors">
    <Icon className={`w-6 h-6 mr-3 mt-1 ${color}`} />
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  </div>
);


const PhaseStat = ({ phaseName, projectsCount, fundingMoved, mentorBenefit, color }) => (
  <div className={`p-4 rounded-lg border-l-4 ${color}`}>
    <h5 className="text-md font-semibold mb-1">{phaseName}</h5>
    <p className="text-xs text-gray-300">Proyectos: {projectsCount}</p>
    <p className="text-xs text-gray-300">Fondos Movidos: {formatCurrency(fundingMoved)}</p>
    <p className="text-xs text-gray-300">Beneficio Estimado Mentor: {formatCurrency(mentorBenefit)}</p>
  </div>
);


const MentorStatisticsModal = ({ isOpen, onClose, projects }) => {
  if (!isOpen) return null;

  const totalProjects = projects.length;
  const projectsByPhase = projects.reduce((acc, p) => {
    acc[p.fase] = (acc[p.fase] || 0) + 1;
    return acc;
  }, {});

  const totalFunding = projects.reduce((sum, p) => sum + p.financiacionCaptada, 0);
  const totalMentorBenefitActual = projects.reduce((sum, p) => sum + p.beneficioEstimadoMentor, 0);

  const currentYear = new Date().getFullYear();
  const simulatedYears = simulacionAnualData.map(yearData => ({
    ...yearData,
    year: parseInt(yearData.ano.split(' ')[1]) 
  }));


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl border border-purple-700/50 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-800 py-2 z-10">
          <h3 className="text-2xl font-semibold gradient-text flex items-center"><BarChart2 className="w-7 h-7 mr-3"/>Estadísticas de Mentoría</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Resumen Actual */}
          <section>
            <h4 className="text-xl font-medium text-purple-300 mb-3">Resumen Actual del Portfolio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatItem icon={Users} label="Total Proyectos Asignados" value={totalProjects} />
              <StatItem icon={DollarSign} label="Financiación Total Captada (Actual)" value={formatCurrency(totalFunding)} color="text-green-400"/>
              <StatItem icon={Award} label="Beneficio Estimado Mentor (Actual)" value={formatCurrency(totalMentorBenefitActual)} color="text-yellow-400"/>
              <StatItem icon={Target} label="Proyectos en Fase Semilla" value={projectsByPhase['Semilla'] || 0} />
              <StatItem icon={TrendingUp} label="Proyectos en Fase Pegaso" value={projectsByPhase['Pegaso'] || 0} />
              <StatItem icon={TrendingUp} label="Proyectos en Fase Dragón" value={projectsByPhase['Dragón'] || 0} color="text-orange-400" />
              <StatItem icon={TrendingUp} label="Proyectos en Fase Unicornio" value={projectsByPhase['Unicornio'] || 0} color="text-pink-400" />
            </div>
          </section>

          {/* Simulación Anual */}
          <section>
            <h4 className="text-xl font-medium text-purple-300 mb-3 flex items-center"><Calendar className="w-5 h-5 mr-2"/>Simulación de Impacto Anual (Próximos 5 Años)</h4>
            <div className="space-y-3">
              {simulatedYears.map((item) => (
                <div key={item.year} className={`p-3 rounded-lg glass-effect-light ${item.year === currentYear ? 'border-l-4 border-purple-400' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg">{item.year} {item.year === currentYear ? '(Año Actual)' : ''}</span>
                    <span className="text-sm text-gray-400">{item.proyectosActivos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Financiación Movida: <span className="text-green-400">{item.financiacionMovida}</span></span>
                    <span className="text-gray-300">Beneficio Estimado: <span className="text-yellow-400">{item.beneficioTotalSimulado}</span></span>
                  </div>
                </div>
              ))}
              <div className="mt-3 p-3 bg-purple-600/30 rounded-lg text-center">
                <p className="text-lg font-semibold">Total Acumulado Estimado en 5 Años: <span className="text-xl text-green-300">{totalAcumulado5Anos}</span></p>
              </div>
            </div>
          </section>
          
          {/* Simulación Alto Impacto */}
           <section>
            <h4 className="text-xl font-medium text-purple-300 mb-3">Proyección de Alto Impacto (Hasta 2030)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulacionAltoImpactoData.map((item, index) => (
                    <StatItem key={index} icon={item.icon} label={item.concepto} value={item.proyeccion} color={item.color || "text-sky-400"}/>
                ))}
            </div>
             <div className="mt-4 p-3 bg-green-600/30 rounded-lg text-center">
                <p className="text-lg font-semibold">TOTAL POSIBLE ESTIMADO: <span className="text-xl text-green-200">+200 M €</span></p>
              </div>
          </section>


        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={onClose} className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
            Cerrar Estadísticas
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MentorStatisticsModal;