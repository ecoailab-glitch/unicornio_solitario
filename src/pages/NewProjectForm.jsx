import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/index';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { sdgData } from '@/contexts/ProjectContext/sdgData';
import { ArrowLeft, Lightbulb, Heart, Briefcase, Plus } from 'lucide-react';

const NewProjectForm = () => {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const { user } = useUser();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    project_kind: 'startup',
    sdgs: [],
    descripcion: '',
    impact_theory: '',
    beneficiaries_estimated: '',
    sector: '',
    region: user?.ciudad || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSdgChange = (sdgId) => {
    setFormData(prev => {
      const newSdgs = prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : [...prev.sdgs, sdgId];
      return { ...prev, sdgs: newSdgs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSdgs = sdgData.filter(s => formData.sdgs.includes(s.id));
    const newProject = {
      ...formData,
      id: `proj_${Date.now()}`,
      creador: user?.nombre || 'Emprendedor Anónimo',
      mentor: 'José Luis Nieto',
      fase: 'Semilla',
      impacto: `${formData.beneficiaries_estimated} personas`,
      financiacionCaptada: 0,
      valorEstimado: 25000,
      beneficioEstimadoMentor: 500,
      sdgs: selectedSdgs,
      impact_kpis: [],
      trace_events: [],
      documentos: ['Propuesta inicial'],
      agentes: [],
      ia: 'IA Asignada por defecto',
      consent_social_share: formData.project_kind !== 'startup'
    };
    addProject(newProject);
    toast({
      title: "¡Proyecto Creado!",
      description: `El proyecto "${formData.nombre}" ha sido añadido al ecosistema.`
    });
    navigate(`/proyecto/${newProject.id}`);
  };

  const projectTypes = [
    { value: 'startup', label: 'Startup', icon: Lightbulb },
    { value: 'ong', label: 'ONG', icon: Heart },
    { value: 'proyecto_social', label: 'Proyecto Social', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-purple-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold gradient-text mb-2">Crear Nuevo Proyecto</h1>
          <p className="text-gray-400 mb-8">Da el primer paso para convertir tu idea en una realidad de impacto.</p>
        </motion.div>
        
        <motion.form onSubmit={handleSubmit} className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="p-6 glass-effect rounded-lg">
                <Label className="text-lg font-semibold text-white">Tipo de Proyecto</Label>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {projectTypes.map(({ value, label, icon: Icon }) => (
                         <div key={value} onClick={() => handleSelectChange('project_kind', value)} className={`cursor-pointer rounded-lg p-4 text-center border-2 transition-all ${formData.project_kind === value ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 bg-slate-800/50'}`}>
                             <Icon className={`w-8 h-8 mx-auto mb-2 ${formData.project_kind === value ? 'text-purple-300' : 'text-gray-400'}`}/>
                             <span className={`font-medium ${formData.project_kind === value ? 'text-white' : 'text-gray-300'}`}>{label}</span>
                         </div>
                    ))}
                </div>
            </div>

            <div className="p-6 glass-effect rounded-lg space-y-6">
              <Input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre del Proyecto" className="text-xl" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="sector" value={formData.sector} onChange={handleInputChange} placeholder="Sector (ej. Salud, Educación)" required />
                <Input name="region" value={formData.region} onChange={handleInputChange} placeholder="Región (ej. Málaga, Global)" required />
              </div>
              <Textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción breve del proyecto" required />
            </div>

            {formData.project_kind !== 'startup' && (
              <div className="p-6 glass-effect rounded-lg space-y-6">
                <h2 className="text-xl font-semibold text-white">Detalles de Impacto</h2>
                <Textarea name="impact_theory" value={formData.impact_theory} onChange={handleInputChange} placeholder="Teoría del Cambio: ¿Cómo generará tu proyecto un impacto positivo?" />
                <Input name="beneficiaries_estimated" type="number" value={formData.beneficiaries_estimated} onChange={handleInputChange} placeholder="Número de beneficiarios estimados" />
                
                <div>
                    <Label className="text-lg font-semibold text-white mb-4 block">Objetivos de Desarrollo Sostenible (ODS)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sdgData.map(sdg => (
                            <div key={sdg.id} className="flex items-center space-x-2">
                                <Checkbox id={`sdg-${sdg.id}`} onCheckedChange={() => handleSdgChange(sdg.id)} checked={formData.sdgs.includes(sdg.id)} />
                                <label htmlFor={`sdg-${sdg.id}`} className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{sdg.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
                <Button type="submit" size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg">
                    <Plus className="w-5 h-5 mr-2"/>
                    Crear Proyecto
                </Button>
            </div>
        </motion.form>
      </div>
    </div>
  );
};

export default NewProjectForm;