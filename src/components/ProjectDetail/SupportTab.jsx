import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, ExternalLink } from 'lucide-react';
import { mentorsData } from '@/contexts/ProjectContext/mentorsData';
import { grantsData } from '@/contexts/ProjectContext/grantsData';

const SupportTab = ({ project }) => {
  const projectSDGNames = project.sdgs.map(s => s.name);

  const suggestedMentors = mentorsData.filter(mentor => 
    mentor.sector.some(sector => projectSDGNames.includes(sector)) ||
    mentor.sector.includes('Todos')
  ).slice(0, 3);

  const suggestedGrants = grantsData.filter(grant =>
    grant.focus.some(focus => projectSDGNames.includes(focus)) &&
    (grant.phase === project.fase || grant.phase === 'Global')
  ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Mentores Sugeridos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedMentors.length > 0 ? suggestedMentors.map(mentor => (
            <div key={mentor.id} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{mentor.name}</p>
                  <p className="text-sm text-blue-300">{mentor.specialty}</p>
                </div>
                <Button size="sm" variant="outline" className="text-purple-300 border-purple-500/50">Contactar</Button>
              </div>
            </div>
          )) : <p className="text-gray-400">No hay mentores sugeridos para este proyecto.</p>}
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            Subvenciones Relevantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {suggestedGrants.length > 0 ? suggestedGrants.map(grant => (
            <div key={grant.id} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-white">{grant.name}</p>
                  <a href={grant.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="text-yellow-300"><ExternalLink className="w-4 h-4"/></Button>
                  </a>
                </div>
                 <p className="text-xs text-gray-400">Vence: {new Date(grant.deadline).toLocaleDateString('es-ES')}</p>
                 <p className="text-sm text-yellow-200">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(grant.amount_min)} - {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(grant.amount_max)}</p>
            </div>
          )) : <p className="text-gray-400">No hay subvenciones sugeridas para este proyecto.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTab;