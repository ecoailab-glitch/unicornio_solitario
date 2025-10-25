import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiInfrastructureData } from '@/lib/aiInfrastructureData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AiInfrastructure = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const Section = ({ title, icon: Icon, children, className = '' }) => (
    <motion.div variants={itemVariants} className={`mb-12 ${className}`}>
      <div className="flex items-center text-3xl font-bold mb-6 text-purple-300">
        {Icon && <Icon className="w-10 h-10 mr-4" />}
        <h2 className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{title}</h2>
      </div>
      <div className="text-gray-300 space-y-4">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <div className="relative z-10 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 pt-8"
        >
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="absolute top-6 left-6 bg-slate-800/50 border-purple-500/50 hover:bg-slate-700/70 text-purple-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Inicio
          </Button>
          <h1 className="text-5xl md:text-7xl font-bold gradient-text">
            {aiInfrastructureData.title}
          </h1>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Section title={aiInfrastructureData.overview.title} icon={aiInfrastructureData.overview.icon}>
            <p className="text-lg md:text-xl leading-relaxed">{aiInfrastructureData.overview.text}</p>
          </Section>

          <Section title={aiInfrastructureData.architecture.title} icon={aiInfrastructureData.architecture.icon}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiInfrastructureData.architecture.levels.map((level) => {
                const LevelIcon = level.icon;
                return (
                  <motion.div variants={itemVariants} key={level.level}>
                    <Card className="bg-slate-800/60 border-purple-600/40 backdrop-blur-sm h-full flex flex-col">
                      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                        {LevelIcon && <LevelIcon className="w-8 h-8 text-purple-400" />}
                        <CardTitle className="text-xl text-purple-300">{level.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-400 mb-3">{level.description}</p>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                          {level.functions.map((func, idx) => (
                            <li key={idx}>{func}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title={aiInfrastructureData.dataset.title} icon={aiInfrastructureData.dataset.icon} className="md:col-span-1">
              <p className="text-lg leading-relaxed">{aiInfrastructureData.dataset.text}</p>
            </Section>
            <Section title={aiInfrastructureData.mareNostrum.title} icon={aiInfrastructureData.mareNostrum.icon} className="md:col-span-1">
              <p className="text-lg leading-relaxed mb-4">{aiInfrastructureData.mareNostrum.text}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {aiInfrastructureData.mareNostrum.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </Section>
          </div>
          
          <Section title={aiInfrastructureData.maturityStages.title} icon={aiInfrastructureData.maturityStages.icon}>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiInfrastructureData.maturityStages.stages.map((stage) => (
                <motion.div variants={itemVariants} key={stage.name}>
                  <Card className={`border-purple-600/40 backdrop-blur-sm h-full flex flex-col ${stage.color}`}>
                    <CardHeader>
                      <CardTitle className="text-xl text-purple-200">{stage.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-300">{stage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Section>

          <Section title={aiInfrastructureData.expectedImpact.title} icon={aiInfrastructureData.expectedImpact.icon}>
            <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
              {aiInfrastructureData.expectedImpact.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </Section>
        </motion.div>
      </div>
    </div>
  );
};

export default AiInfrastructure;