import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, DollarSign, FileText } from 'lucide-react';

const SummaryTab = ({ project }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Descripción del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{project.descripcion}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              IA y Agentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <h4 className="font-semibold text-purple-300 text-sm">IA: {project.ia}</h4>
            <ul className="list-disc list-inside text-sm text-gray-300 pl-2">
              {project.agentes.map((agente, index) => (
                <li key={index}>{agente}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-lg">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-300">
             {project.documentos.map((doc, index) => (
                <p key={index}>- {doc}</p>
              ))}
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-lg">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              Financiación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-gray-300">Captada: <span className="font-bold text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(project.financiacionCaptada)}</span></p>
            <p className="text-gray-300">Valoración: <span className="font-bold text-white">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(project.valorEstimado)}</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryTab;