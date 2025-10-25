
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Lightbulb, Users, TrendingUp, Sparkles, Rocket, UserCheck, BrainCircuit, FolderHeart, Filter, Globe, HeartHandshake, Building } from 'lucide-react';
import EcosystemEvolution from '@/components/EcosystemEvolution';
import EcosystemPillars from '@/components/EcosystemPillars'; 
import { useUser } from '@/contexts/UserContext';
import { simulatedUsers } from '@/lib/simulatedUsers';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const userTypes = [
    {
      type: 'nodo',
      title: 'Soy Nodo',
      description: 'Instituciones como Impact Hub que impulsan el ecosistema y lanzan retos.',
      icon: Building2,
      color: 'from-purple-500 to-purple-700',
      features: ['Gestión de proyectos', 'Lanzar retos', 'Red de contactos']
    },
    {
      type: 'emprendedor',
      title: 'Soy Emprendedor',
      description: 'Innovadores con ideas que cambiarán el mundo y resuelven retos.',
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-700',
      features: ['Guía con IA', 'Participar en retos', 'Conecta con mentores']
    },
    {
      type: 'mentor',
      title: 'Soy Mentor',
      description: 'Expertos que guían el crecimiento de startups y proyectos.',
      icon: Users,
      color: 'from-green-500 to-green-700',
      features: ['Proyectos en tu área', 'Impacto medible', 'Red de mentores']
    },
    {
      type: 'inversor',
      title: 'Soy Inversor',
      description: 'Financiadores del futuro tecnológico con impacto social.',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-700',
      features: ['Oportunidades Dragón', 'Due diligence', 'ROI proyectado']
    },
    {
      type: 'gran_empresa',
      title: 'Soy Gran Empresa',
      description: 'Crea tu propia incubadora de innovación corporativa en el ecosistema.',
      icon: Building,
      color: 'from-gray-500 to-gray-700',
      features: ['Incubadora interna', 'Gestiona intraemprendedores', 'Mide el impacto']
    },
    {
      type: 'proyecto_social',
      title: 'Soy Proyecto Social',
      description: 'ONGs y entidades que buscan maximizar su impacto social.',
      icon: HeartHandshake,
      color: 'from-pink-500 to-pink-700',
      features: ['Mide tu impacto social', 'Conecta con voluntarios', 'Busca financiación']
    }
  ];

  const quickMetrics = [
    { icon: <Globe className="w-8 h-8"/>, value: "600.000", label: "Personas en red", color: "text-blue-400" },
    { icon: <Lightbulb className="w-8 h-8"/>, value: "50.000", label: "Proyectos semilla", color: "text-green-400" },
    { icon: <Rocket className="w-8 h-8"/>, value: "5.000", label: "Pegasos activos", color: "text-yellow-400" },
    { icon: <Sparkles className="w-8 h-8"/>, value: "500", label: "Potenciales Unicornios", color: "text-purple-400" },
  ];

  const handleRoleSelection = (roleType) => {
    const userToLogin = simulatedUsers[roleType];
    if (userToLogin) {
      login(userToLogin);
      navigate(`/dashboard/${roleType}`);
    } else {
      console.error(`No simulated user found for role: ${roleType}`);
      navigate('/'); 
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f0f23]">
      <div className="absolute inset-0 hero-pattern opacity-50" />
      
      <div className="absolute top-20 left-10 floating-animation">
        <Sparkles className="w-8 h-8 text-purple-400 opacity-40" />
      </div>
      <div className="absolute top-40 right-20 floating-animation" style={{ animationDelay: '2s' }}>
        <Rocket className="w-12 h-12 text-blue-400 opacity-40" />
      </div>
      <div className="absolute bottom-40 left-20 floating-animation" style={{ animationDelay: '4s' }}>
        <Sparkles className="w-6 h-6 text-green-400 opacity-40" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
              Unicornio Solitario
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto">
              Plataforma avanzada que conecta nodos, emprendedores, mentores e inversores para un futuro de impacto.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-12"
            >
              <img
                className="w-full max-w-4xl mx-auto rounded-xl shadow-lg glass-effect p-4" 
                alt="Ecosistema tecnológico innovador con un unicornio representando la visión del proyecto"
                 src="https://images.unsplash.com/photo-1595251742221-0065be155d45" />
            </motion.div>
          </motion.div>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text-teal">Métricas Clave del Ecosistema</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {quickMetrics.map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="metric-card text-center flex flex-col items-center justify-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${metric.color.replace('text-', 'bg-')} bg-opacity-20`}>
                    {metric.icon}
                  </div>
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {userTypes.map((userType) => {
              const IconComponent = userType.icon;
              return (
                <motion.div
                  key={userType.type}
                  className="group"
                >
                  <div className="role-card card-hover cursor-pointer h-full flex flex-col"
                       onClick={() => handleRoleSelection(userType.type)}>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${userType.color} flex items-center justify-center mb-6 mx-auto pulse-glow`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-center mb-3 gradient-text">
                      {userType.title}
                    </h3>
                    
                    <p className="text-gray-400 text-center text-sm mb-6 flex-grow">
                      {userType.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {userType.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-500 flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 text-white font-semibold py-3 rounded-md transition-all duration-300 mt-auto shadow-lg"
                    >
                      Entrar como {userType.title.split(' ')[1]}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
           <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center mb-16 space-x-4"
          >
            <Button
              onClick={() => navigate('/infraestructura-ia')}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-none"
            >
              <BrainCircuit className="w-6 h-6 mr-3" />
              Conoce la IA
            </Button>
            <Button 
              onClick={() => navigate('/mentor-simulation')}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <UserCheck className="w-6 h-6 mr-3" />
              Panel Mentor
            </Button>
          </motion.div>
        </div> 

        <EcosystemPillars />

        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="my-16 md:my-24"
        >
            <div className="container mx-auto px-4">
                <div className="glass-effect rounded-2xl p-8 md:p-12 border border-teal-500/30 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-teal">Embudo de Posibilidades</h2>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                        Visualiza el viaje completo de los proyectos en nuestro ecosistema, desde su origen en nuestras instituciones colaboradoras hasta convertirse en unicornios de impacto.
                    </p>
                    <Button
                        onClick={() => navigate('/funnel')}
                        size="lg"
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-none"
                    >
                        <Filter className="w-6 h-6 mr-3" />
                        Explorar el Embudo
                    </Button>
                </div>
            </div>
        </motion.section>

        <EcosystemEvolution />

        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-8 gradient-text">
              Más del Ecosistema
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { title: 'Proyectos de Impacto', icon: FolderHeart, color: 'phase-semilla', description: 'ONGs y proyectos sociales con una misión clara.' },
                { title: 'Startups Disruptivas', icon: Rocket, color: 'phase-pegaso', description: 'Empresas tecnológicas con alto potencial de crecimiento.' },
                { title: 'Inversión Estratégica', icon: TrendingUp, color: 'phase-dragon', description: 'Oportunidades para financiar el futuro.' },
                { title: 'Innovación Abierta', icon: BrainCircuit, color: 'phase-unicornio', description: 'Colaboración para crear tecnologías que cambian el juego.' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + item.title.length * 0.01 }}
                    className={`${item.color} rounded-xl p-6 text-white flex flex-col`}
                  >
                    <Icon className="w-8 h-8 mb-3"/>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90 flex-grow">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                onClick={() => navigate('/simulador')}
                className="bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🦄 Simular mi Unicornio
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
