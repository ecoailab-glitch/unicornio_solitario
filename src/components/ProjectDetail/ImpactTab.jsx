import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Users, TrendingUp, Edit, Save, X } from 'lucide-react';
import { sdgData } from '@/contexts/ProjectContext/sdgData';

const ImpactTab = ({ project, updateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    impact_theory: project.impact_theory || '',
    beneficiaries_estimated: project.beneficiaries_estimated || 0,
    beneficiaries_served: project.beneficiaries_served || 0,
    impact_kpis: project.impact_kpis ? JSON.parse(JSON.stringify(project.impact_kpis)) : []
  });

  const handleSave = () => {
    updateProject(project.id, formData);
    setIsEditing(false);
  };
  
  const handleKPIChange = (index, field, value) => {
    const newKpis = [...formData.impact_kpis];
    newKpis[index][field] = value;
    setFormData(prev => ({...prev, impact_kpis: newKpis}));
  };

  const projectSDGIds = project.sdgs.map(s => s.id);

  return (
    <div className="space-y-6">
       <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Teoría del Cambio
          </CardTitle>
           {isEditing ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-1"/> Guardar</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-1"/> Cancelar</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" className="text-purple-300 border-purple-500/50" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>
            )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={formData.impact_theory}
              onChange={(e) => setFormData(prev => ({...prev, impact_theory: e.target.value}))}
              className="w-full bg-slate-800/50 border-purple-500/30 rounded-md p-2 text-gray-300"
              rows={4}
            />
          ) : (
            <p className="text-gray-300 leading-relaxed">{project.impact_theory}</p>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Beneficiarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {isEditing ? (
                 <>
                  <div>
                    <Label className="text-gray-400 text-sm">Estimados</Label>
                    <Input type="number" value={formData.beneficiaries_estimated} onChange={e => setFormData(prev => ({...prev, beneficiaries_estimated: parseInt(e.target.value)}))} className="bg-slate-800/50 border-purple-500/30 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Alcanzados</Label>
                    <Input type="number" value={formData.beneficiaries_served} onChange={e => setFormData(prev => ({...prev, beneficiaries_served: parseInt(e.target.value)}))} className="bg-slate-800/50 border-purple-500/30 text-white" />
                  </div>
                 </>
               ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Estimados</p>
                    <p className="text-2xl font-bold text-white">{project.beneficiaries_estimated?.toLocaleString('es-ES') || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Alcanzados</p>
                    <p className="text-2xl font-bold text-white">{project.beneficiaries_served?.toLocaleString('es-ES') || 0}</p>
                  </div>
                </>
               )}
            </CardContent>
        </Card>
        <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                KPIs de Impacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditing ? formData.impact_kpis.map((kpi, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                   <Input value={kpi.name} onChange={e => handleKPIChange(index, 'name', e.target.value)} className="col-span-3 bg-slate-800/50 border-purple-500/30 text-white" />
                   <Input type="text" value={kpi.current} onChange={e => handleKPIChange(index, 'current', e.target.value)} placeholder="Actual" className="bg-slate-800/50 border-purple-500/30 text-white" />
                   <Input type="text" value={kpi.target} onChange={e => handleKPIChange(index, 'target', e.target.value)} placeholder="Objetivo" className="bg-slate-800/50 border-purple-500/30 text-white" />
                   <Input value={kpi.unit} onChange={e => handleKPIChange(index, 'unit', e.target.value)} placeholder="Unidad" className="bg-slate-800/50 border-purple-500/30 text-white" />
                </div>
              )) : (project.impact_kpis || []).map((kpi, index) => (
                <div key={index}>
                    <div className="flex justify-between text-sm">
                        <p className="text-gray-300">{kpi.name} ({kpi.unit})</p>
                        <p className="text-white font-semibold">{kpi.current} / <span className="text-gray-400">{kpi.target}</span></p>
                    </div>
                     <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(parseFloat(kpi.current) / parseFloat(kpi.target) * 100)}%` }}></div>
                    </div>
                </div>
              ))}
            </CardContent>
        </Card>
      </div>

       <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white">Alineación con ODS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {sdgData.map(sdg => {
            const isAligned = projectSDGIds.includes(sdg.id);
            return (
              <div key={sdg.id} title={sdg.name} className={`w-16 h-16 rounded-md transition-all duration-300 ${isAligned ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`} style={{ backgroundColor: sdg.color }}>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactTab;