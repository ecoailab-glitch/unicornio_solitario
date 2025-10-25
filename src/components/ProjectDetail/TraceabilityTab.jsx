import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Clock, FileCheck2, Hash, Edit3, Award } from 'lucide-react';

const TraceabilityTab = ({ project }) => {

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'PROJECT_CREATED': return <Edit3 className="w-5 h-5 text-green-400" />;
      case 'LLM_EVALUATED': return <FileCheck2 className="w-5 h-5 text-purple-400" />;
      case 'GRANT_AWARDED': return <Award className="w-5 h-5 text-yellow-400" />;
      default: return <Hash className="w-5 h-5 text-gray-400" />;
    }
  }

  const getEventName = (eventType) => {
    const names = {
        PROJECT_CREATED: 'Creación del Proyecto',
        LLM_EVALUATED: 'Consejo IA Anclado',
        MOU_SIGNED: 'Acuerdo Firmado',
        GRANT_APPLIED: 'Subvención Solicitada',
        GRANT_AWARDED: 'Subvención Concedida',
    };
    return names[eventType] || 'Evento Desconocido';
  }


  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Anchor className="w-5 h-5 mr-2 text-blue-400" />
          Trazabilidad en Gravity (v1)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {project.trace_events && project.trace_events.length > 0 ? (
          <div className="relative pl-6">
             <div className="absolute left-[34px] top-0 bottom-0 w-0.5 bg-purple-500/30" />
             {project.trace_events.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map((event, index) => (
               <div key={event.id} className="relative mb-8">
                  <div className="absolute -left-5 top-1.5 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-purple-500/50">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg ml-8">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-blue-300">{getEventName(event.event_type)}</h4>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(event.created_at).toLocaleString('es-ES')}
                        </div>
                    </div>
                    <div className="text-xs space-y-1 text-gray-500">
                      <p>Content Hash: <span className="font-mono">{event.content_hash}</span></p>
                      <p>Tx Hash: <span className="font-mono">{event.tx_hash}</span></p>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">Aún no hay eventos de trazabilidad registrados en Gravity.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TraceabilityTab;