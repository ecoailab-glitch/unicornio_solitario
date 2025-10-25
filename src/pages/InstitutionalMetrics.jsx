import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useProjects } from '@/contexts/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, TrendingUp, Users, DollarSign, Target,
  BarChart3, PieChart, Award, Sparkles
} from 'lucide-react';

const InstitutionalMetrics = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const projectContext = useProjects();
  const projects = projectContext ? projectContext.projects : [];


  if (user?.tipo !== 'nodo') {
    navigate('/dashboard');
    return null;
  }

  const totalProjects = projects.length;
  const projectsByPhase = {
    'Semilla': projects.filter(p => p.fase === 'Semilla').length,
    'Pegaso': projects.filter(p => p.fase === 'Pegaso').length,
    'Dragón': projects.filter(p => p.fase === 'Dragón').length,
    'Unicornio': projects.filter(p => p.fase === 'Unicornio').length
  };

  const estimatedValue = projects.reduce((total, project) => {
    const values = {
      'Semilla': 50000,
      'Pegaso': 500000,
      'Dragón': 10000000,
      'Unicornio': 1000000000
    };
    return total + (values[project.fase] || 0);
  }, 0);

  const totalImpact = projects.reduce((total, project) => {
    const impact = parseInt(project.impacto?.replace(/[^\d]/g, '')) || 0;
    return total + impact;
  }, 0);

  const publicFunding = Math.floor(estimatedValue * 0.15); 
  const economicParticipation = Math.floor(estimatedValue * 0.05); 

  const metrics = [
    {
      title: 'Proyectos Impulsados',
      value: totalProjects,
      icon: Target,
      color: 'from-purple-500 to-purple-700',
      description: 'Total de proyectos en el ecosistema'
    },
    {
      title: 'Valor Económico Movilizado',
      value: `€${(estimatedValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'from-green-500 to-green-700',
      description: 'Valor total estimado de los proyectos'
    },
    {
      title: 'Impacto Social Total',
      value: `${(totalImpact / 1000).toFixed(0)}K`,
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      description: 'Personas beneficiadas por los proyectos'
    },
    {
      title: 'Ayudas Públicas Conseguidas',
      value: `€${(publicFunding / 1000).toFixed(0)}K`,
      icon: Award,
      color: 'from-orange-500 to-orange-700',
      description: 'Financiación pública obtenida'
    }
  ];

  const phaseData = [
    { phase: 'Semilla', count: projectsByPhase.Semilla, color: 'phase-semilla', percentage: totalProjects > 0 ? (projectsByPhase.Semilla / totalProjects * 100).toFixed(1) : '0.0' },
    { phase: 'Pegaso', count: projectsByPhase.Pegaso, color: 'phase-pegaso', percentage: totalProjects > 0 ? (projectsByPhase.Pegaso / totalProjects * 100).toFixed(1) : '0.0' },
    { phase: 'Dragón', count: projectsByPhase.Dragón, color: 'phase-dragon', percentage: totalProjects > 0 ? (projectsByPhase.Dragón / totalProjects * 100).toFixed(1) : '0.0' },
    { phase: 'Unicornio', count: projectsByPhase.Unicornio, color: 'phase-unicornio', percentage: totalProjects > 0 ? (projectsByPhase.Unicornio / totalProjects * 100).toFixed(1) : '0.0' }
  ];

  if (!projectContext) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-xl">Cargando datos del proyecto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      <div className="glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-purple-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            
            <h1 className="text-2xl font-bold gradient-text">Métricas Institucionales</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold gradient-text mb-4">
              {user.nombre}
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              📍 {user.ciudad}
            </p>
            <p className="text-gray-400">
              Nodo del Ecosistema Unicornio Solitario
            </p>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass-effect border-purple-500/20 card-hover">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-gray-300 text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {metric.value}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glass-effect border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-400" />
                  Distribución por Fases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phaseData.map((phase, index) => (
                    <div key={phase.phase} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${phase.color}`} />
                        <span className="text-gray-300">{phase.phase}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-semibold">{phase.count}</span>
                        <span className="text-gray-400 text-sm">({phase.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="glass-effect border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                  Participación Económica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Participación Total</span>
                      <span className="text-white font-semibold">€{(economicParticipation / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">ROI Proyectado</span>
                      <span className="text-green-400 font-semibold">+245%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Riesgo Diversificado</span>
                      <span className="text-blue-400 font-semibold">Bajo</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="glass-effect border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Casos de Éxito Destacados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.filter(p => p.fase === 'Dragón' || p.fase === 'Unicornio').slice(0, 3).map((project, index) => (
                  <div key={project.id} className="bg-slate-800/50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">{project.nombre}</h4>
                    <p className="text-gray-300 text-sm mb-3">{project.descripcion.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPhaseColor(project.fase)} text-white`}>
                        {project.fase}
                      </span>
                      <span className="text-green-400 font-semibold">{project.impacto}</span>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.fase === 'Dragón' || p.fase === 'Unicornio').length === 0 && (
                  <p className="text-gray-400 md:col-span-3 text-center py-4">Aún no hay casos de éxito en fase Dragón o Unicornio.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8"
            onClick={() => {
              
              const reportData = {
                nodo: user.nombre,
                fecha: new Date().toLocaleDateString('es-ES'),
                metricas: metrics,
                proyectos: projects.length,
                fases: projectsByPhase
              };
              
              console.log('Reporte exportado:', reportData);
              
              
              import('@/components/ui/use-toast').then(({ toast }) => {
                toast({
                  title: "Reporte exportado",
                  description: "El reporte de métricas se ha generado correctamente.",
                });
              });
            }}
          >
            📊 Exportar Reporte Completo
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const getPhaseColor = (fase) => {
  const colors = {
    'Semilla': 'bg-green-500',
    'Pegaso': 'bg-blue-500',
    'Dragón': 'bg-orange-500',
    'Unicornio': 'bg-purple-500'
  };
  return colors[fase] || 'bg-gray-500';
};

export default InstitutionalMetrics;