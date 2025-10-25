import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, Users } from 'lucide-react';
import { analyzeProjectWithAI } from '@/lib/aiService';

const getPhaseColor = (fase) => {
  const colors = {
    'Semilla': 'phase-semilla',
    'Pegaso': 'phase-pegaso',
    'Dragón': 'phase-dragon',
    'Unicornio': 'phase-unicornio'
  };
  return colors[fase] || 'bg-gray-500';
};

const ProjectsGrid = ({ projects, navigate, setShowAiChatWindow }) => {
  const [analyzingProjectId, setAnalyzingProjectId] = useState(null);

  const handleAnalyzeProjectWithAIWrapper = async (projectId, projectName) => {
    setAnalyzingProjectId(projectId);
    setShowAiChatWindow(true); 
    
    
    const projectToAnalyze = projects.find(p => p.id === projectId);
    if (projectToAnalyze) {
      
      const response = await analyzeProjectWithAI(projectToAnalyze);
      
    }
    setAnalyzingProjectId(null);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Proyectos del Ecosistema ({projects.length})
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
            className="glass-effect rounded-2xl p-6 card-hover h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge className={`${getPhaseColor(project.fase)} text-white`}>
                  {project.fase}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleAnalyzeProjectWithAIWrapper(project.id, project.nombre);
                  }}
                  disabled={analyzingProjectId === project.id}
                >
                  {analyzingProjectId === project.id ? 
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> :
                    <Sparkles className="w-4 h-4 text-purple-400 hover:text-purple-300" />
                  }
                </Button>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">{project.nombre}</h4>
              <p className="text-gray-300 mb-3 text-sm">Por {project.creador}</p>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.descripcion}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  {project.ia}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  Impacto: {project.impacto}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm text-purple-300">{project.sector}</span>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate(`/proyecto/${project.id}`)}>
                <Eye className="w-4 h-4 mr-2" />
                Ver más
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron proyectos con los filtros seleccionados.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsGrid;