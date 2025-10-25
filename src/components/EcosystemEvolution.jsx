import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Gem, ShieldCheck, TrendingUp, ChevronDown, ChevronUp, Users, DollarSign, Target, Lightbulb, BrainCircuit, Cog, Rocket } from 'lucide-react';

const evolutionData = [
  {
    phase: 'Fase 0: Hoja en Blanco',
    title: 'Propósito y Visión',
    icon: Lightbulb,
    color: 'text-purple-400',
    bgColor: 'bg-purple-600',
    description: 'Descubrir la idea correcta conectada con el talento del emprendedor.',
    iaTech: [
      { name: 'Asistente IA personalizado (LLMs)', icon: BrainCircuit },
      { name: 'Tests guiados de propósito y modelo de negocio', icon: Target },
      { name: 'Simulador de ideas por sector', icon: Cog },
    ],
    funding: {
      title: 'Financiación Inicial',
      icon: DollarSign,
      amount: '60.000 – 100.000 €',
      sources: 'Subvenciones locales y europeas',
    },
    duration: "Mes 1-3"
  },
  {
    phase: 'Fase Pegaso',
    title: 'Primer Prototipo Inteligente',
    icon: Rocket,
    color: 'text-blue-400',
    bgColor: 'bg-blue-600',
    description: 'Automatizar tareas iniciales y validar el producto mínimo viable.',
    iaTech: [
      { name: 'LLMs + RPA para automatización básica', icon: Cog },
      { name: 'Agentes básicos para gestión operativa', icon: Users },
      { name: 'Primer nivel de razonamiento IA', icon: Brain },
    ],
    funding: {
      title: 'Capital Semilla',
      icon: DollarSign,
      amount: '4 M € (Valoración 10 M €)',
      sources: 'SafeBrok, Inversores Ángel',
    },
    duration: "Mes 4-12"
  },
  {
    phase: 'Fase Dragón',
    title: 'IA Creativa y Escalado',
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-600',
    description: 'El sistema IA empieza a crear y adaptar, escalando el negocio.',
    iaTech: [
      { name: 'IA generativa real + Agentes autónomos especializados', icon: BrainCircuit },
      { name: 'Arquitectura algorítmica propia', icon: Cog },
      { name: 'Integración IA multimodal (imagen, voz, vídeo)', icon: Zap },
    ],
    funding: {
      title: 'Serie A',
      icon: DollarSign,
      amount: '40 M € (Valoración 100 M €)',
      sources: 'Fondos institucionales, Venture Capital',
    },
    duration: "Año 2"
  },
  {
    phase: 'Fase IA Virtual',
    title: 'Sistema Operativo Inteligente',
    icon: ShieldCheck,
    color: 'text-green-400',
    bgColor: 'bg-green-600',
    description: 'Agentes colaborativos en red gestionan la totalidad del negocio.',
    iaTech: [
      { name: 'Agentes IA colaborativos en red', icon: Users },
      { name: 'Gestión autónoma de operaciones y marketing', icon: Cog },
      { name: 'Sistema IA que aprende y optimiza continuamente', icon: Brain },
    ],
    funding: {
      title: 'Crecimiento Orgánico / Preparación Salida',
      icon: TrendingUp,
      amount: 'No requiere nueva ronda externa',
      sources: 'Beneficios reinvertidos, licencias',
    },
    duration: "Año 3"
  },
  {
    phase: 'Fase Unicornio',
    title: 'Superautomatización y Escalabilidad Infinita',
    icon: Gem,
    color: 'text-pink-400',
    bgColor: 'bg-pink-600',
    description: 'El negocio es un organismo vivo, automatizado y global, capaz de expandirse sin intervención humana directa.',
    iaTech: [
      { name: 'IA generativa avanzada + Superagentes', icon: BrainCircuit },
      { name: 'Arquitectura algorítmica auto-evolutiva', icon: Zap },
      { name: 'Gestión IA de todos los recursos y expansión global', icon: Cog },
    ],
    funding: {
      title: 'Salida / IPO',
      icon: Gem,
      amount: 'Valoración +1.000 M €',
      sources: 'Salida a bolsa, Adquisición estratégica',
    },
    duration: "Año 4+"
  },
];

const EvolutionCard = ({ item, index, expanded, setExpanded }) => {
  const IconComponent = item.icon;
  const isExpanded = expanded === index;

  return (
    <motion.div
      layout
      className="glass-effect rounded-xl p-1 mb-4 border border-purple-500/30 overflow-hidden"
    >
      <motion.div
        layout
        className={`flex items-center justify-between p-4 cursor-pointer ${item.bgColor} rounded-t-lg`}
        onClick={() => setExpanded(isExpanded ? null : index)}
      >
        <div className="flex items-center">
          <IconComponent className={`w-8 h-8 mr-4 ${item.color}`} />
          <div>
            <h3 className={`text-lg font-bold ${item.color}`}>{item.phase}</h3>
            <p className="text-sm text-gray-200">{item.title} - {item.duration}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-200" /> : <ChevronDown className="w-6 h-6 text-gray-200" />}
      </motion.div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-slate-800/50 rounded-b-lg"
        >
          <p className="text-gray-300 mb-6 text-sm">{item.description}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-purple-300 mb-3 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2" /> Tecnología IA Clave
              </h4>
              <ul className="space-y-2">
                {item.iaTech.map((tech, idx) => {
                  const TechIcon = tech.icon;
                  return (
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <TechIcon className="w-4 h-4 mr-2 text-purple-400" />
                    {tech.name}
                  </li>
                )})}
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-green-300 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" /> Financiación y Valoración
              </h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="flex items-center">
                  <item.funding.icon className="w-4 h-4 mr-2 text-green-400" />
                  <strong>{item.funding.title}:</strong>&nbsp;{item.funding.amount}
                </p>
                <p>
                  <strong>Fuentes:</strong>&nbsp;{item.funding.sources}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const EcosystemEvolution = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-purple-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            La Evolución del Unicornio Solitario
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Un viaje de 4 años desde la idea hasta la superautomatización, impulsado por IA y financiación estratégica.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line - pseudo element approach might be better for complex curves */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-purple-500/30 transform -translate-x-1/2 hidden md:block rounded-full"></div>
          
          {evolutionData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="md:w-full md:flex md:justify-center mb-8"
            >
              <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                 <EvolutionCard item={item} index={index} expanded={expanded} setExpanded={setExpanded} />
              </div>
              {/* This empty div is for spacing on desktop, not ideal but works for now */}
              {index % 2 !== 0 && <div className="hidden md:block md:w-1/2"></div>}


            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemEvolution;