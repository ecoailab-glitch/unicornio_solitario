import React, { useState } from 'react';
import SectionCard from './SectionCard';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AddProjectScreen = ({ addProjectCallback, toast, mariaAlonsoData }) => {
  const [newProjectForm, setNewProjectForm] = useState({
    nombre: '',
    email: '',
    sector: '',
    ideaClara: false,
    quiereAgenteIA: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProjectForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.nombre || !newProjectForm.email || !newProjectForm.sector) {
      toast({ title: "Error", description: "Por favor, completa todos los campos obligatorios.", variant: "destructive" });
      return;
    }
    const newProjectData = {
      nombre: newProjectForm.nombre,
      creador: newProjectForm.nombre, 
      fase: 'Semilla',
      sector: newProjectForm.sector,
      region: mariaAlonsoData.nodo.split(' ').pop() || 'Málaga', 
      descripcion: `Nuevo proyecto de ${newProjectForm.nombre} en el sector ${newProjectForm.sector}. ${newProjectForm.ideaClara ? 'Tiene una idea clara.' : 'Explorando ideas.'}`,
      ia: newProjectForm.quiereAgenteIA ? 'Agente IA por asignar' : 'Sin agente IA solicitado',
      agentes: [],
      mentor: mariaAlonsoData.nombreCompleto,
      impacto: 'Por definir',
      documentos: ['Brief inicial'],
      financiacionCaptada: 0,
      valorEstimado: 50000, 
      beneficioEstimadoMentor: 1000, 
    };
    addProjectCallback(newProjectData);
    toast({ title: "¡Proyecto añadido!", description: `${newProjectForm.nombre} ha sido añadido a tu cartera.` });
    setNewProjectForm({ nombre: '', email: '', sector: '', ideaClara: false, quiereAgenteIA: false });
  };

  return (
    <SectionCard title="Añadir Nuevo Proyecto / Invitar Emprendedor" icon={PlusCircle} delay={0.5}>
      <form onSubmit={handleAddProject} className="space-y-4 p-2">
        <div>
          <Label htmlFor="nombre" className="text-sm text-gray-300">Nombre del Emprendedor/Proyecto</Label>
          <Input id="nombre" name="nombre" value={newProjectForm.nombre} onChange={handleInputChange} className="bg-slate-800/50 border-purple-500/30" required />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
          <Input id="email" name="email" type="email" value={newProjectForm.email} onChange={handleInputChange} className="bg-slate-800/50 border-purple-500/30" required />
        </div>
        <div>
          <Label htmlFor="sector" className="text-sm text-gray-300">Sector</Label>
          <Input id="sector" name="sector" value={newProjectForm.sector} onChange={handleInputChange} className="bg-slate-800/50 border-purple-500/30" required />
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <input type="checkbox" id="ideaClara" name="ideaClara" checked={newProjectForm.ideaClara} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-purple-600 bg-slate-700 border-purple-500/50 rounded focus:ring-purple-500" />
          <Label htmlFor="ideaClara" className="text-sm text-gray-300">¿Tiene una idea clara?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="quiereAgenteIA" name="quiereAgenteIA" checked={newProjectForm.quiereAgenteIA} onChange={handleInputChange} className="form-checkbox h-4 w-4 text-purple-600 bg-slate-700 border-purple-500/50 rounded focus:ring-purple-500" />
          <Label htmlFor="quiereAgenteIA" className="text-sm text-gray-300">¿Quiere un Agente IA asignado?</Label>
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">Guardar Proyecto Vinculado a Mi Nodo</Button>
      </form>
    </SectionCard>
  );
};

export default AddProjectScreen;