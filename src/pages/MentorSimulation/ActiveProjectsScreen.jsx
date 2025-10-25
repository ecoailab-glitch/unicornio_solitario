import React from 'react';
import SectionCard from './SectionCard';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getPhaseColor, formatCurrency } from './utils';

const ActiveProjectsScreen = ({ mentorProjects, navigate, setCurrentScreen, mariaAlonsoData }) => {
  return (
    <SectionCard title={`Mis Proyectos Activos (${mentorProjects.length})`} icon={Briefcase} delay={0.4}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto scrollbar-hide p-1">
        {mentorProjects.map(project => (
          <Card key={project.id} className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-purple-300">{project.nombre}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${getPhaseColor(project.fase)}`}>{project.fase}</span>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>Inversión Captada: <span className="font-semibold">{formatCurrency(project.financiacionCaptada, true)}</span></p>
              <p>Beneficio Estimado: <span className="font-semibold text-green-400">{formatCurrency(project.beneficioEstimadoMentor, true)}</span></p>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="text-xs border-purple-500/50 text-purple-300" onClick={() => navigate(`/proyecto/${project.id}`)}>Ver progreso</Button>
                <Button size="sm" variant="outline" className="text-xs border-green-500/50 text-green-300" onClick={() => setCurrentScreen(6)}>Invitar Emprendedor</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {mentorProjects.length === 0 && <p className="text-gray-400 text-center py-4 md:col-span-2">No hay proyectos asignados actualmente.</p>}
      </div>
    </SectionCard>
  );
};

export default ActiveProjectsScreen;