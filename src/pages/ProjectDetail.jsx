import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/index';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Check, ShieldCheck, FileText, Anchor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAiAdvice, simpleHash } from '@/lib/aiService';

// Importar nuevos componentes de pestañas
import SummaryTab from '@/components/ProjectDetail/SummaryTab';
import ImpactTab from '@/components/ProjectDetail/ImpactTab';
import AdviceTab from '@/components/ProjectDetail/AdviceTab';
import SupportTab from '@/components/ProjectDetail/SupportTab';
import TraceabilityTab from '@/components/ProjectDetail/TraceabilityTab';
import TrainingTab from '@/components/ProjectDetail/TrainingTab';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectContext = useProjects();
  const projects = projectContext ? projectContext.projects : [];
  const updateProject = projectContext ? projectContext.updateProject : () => {};
  const { user } = useUser();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("summary");

  const project = projects.find(p => p.id === id);

  if (!projectContext) {
    return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
       <p className="text-white text-xl">Cargando datos del proyecto...</p>
     </div>
   );
 }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Proyecto no encontrado</p>
      </div>
    );
  }

  const getPhaseColor = (fase) => {
    const colors = {
      'Semilla': 'phase-semilla',
      'Pegaso': 'phase-pegaso',
      'Dragón': 'phase-dragon',
      'Unicornio': 'phase-unicornio'
    };
    return colors[fase] || 'bg-gray-500';
  };
  
  const handleConsent = (consent) => {
    if (updateProject) {
      updateProject(project.id, { consent_social_share: consent });
      toast({
        title: "Consentimiento actualizado",
        description: consent ? "Tu proyecto ahora es visible para nodos de gobierno y ONGs." : "Tu proyecto ya no es visible para nodos de gobierno y ONGs."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      <div className="glass-effect border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-purple-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Badge className={`${getPhaseColor(project.fase)} text-white text-lg px-4 py-2`}>
                Fase {project.fase}
              </Badge>
              <span className="text-purple-300 uppercase text-sm font-bold tracking-wider">{project.project_kind}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
              {project.nombre}
            </h1>
            
            <p className="text-lg text-gray-400">
              Liderado por <span className="text-purple-300 font-semibold">{project.creador}</span> en {project.region}
            </p>
          </motion.div>

          {project.project_kind !== 'startup' && project.consent_social_share !== true && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4"
             >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1"/>
                <div>
                  <h3 className="font-semibold text-yellow-300">Aumenta tu Visibilidad</h3>
                  <p className="text-sm text-yellow-400/80">Permitir que nodos de gobierno, ONGs e instituciones vean este proyecto puede abrir puertas a nuevas subvenciones y colaboraciones.</p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button onClick={() => handleConsent(true)} size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2"/>Permitir</Button>
              </div>
             </motion.div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 glass-effect p-1 h-auto">
              <TabsTrigger value="summary">Resumen</TabsTrigger>
              <TabsTrigger value="impact">Impacto</TabsTrigger>
              <TabsTrigger value="advice">Consejo IA</TabsTrigger>
              <TabsTrigger value="support">Apoyos</TabsTrigger>
              <TabsTrigger value="traceability">Trazabilidad</TabsTrigger>
              <TabsTrigger value="training">Formación</TabsTrigger>
            </TabsList>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TabsContent value="summary">
                <SummaryTab project={project} />
              </TabsContent>
              <TabsContent value="impact">
                <ImpactTab project={project} updateProject={updateProject} />
              </TabsContent>
              <TabsContent value="advice">
                <AdviceTab project={project} updateProject={updateProject} />
              </TabsContent>
              <TabsContent value="support">
                <SupportTab project={project} />
              </TabsContent>
              <TabsContent value="traceability">
                <TraceabilityTab project={project} />
              </TabsContent>
              <TabsContent value="training">
                <TrainingTab project={project} updateProject={updateProject} />
              </TabsContent>
            </motion.div>
          </Tabs>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;