
import { BrainCircuit, Database, Zap, Layers, Users, Target, TrendingUp, CheckCircle, Cpu, BookOpen, Lightbulb, Brain, Building, HeartHandshake, Trophy } from 'lucide-react';

export const aiInfrastructureData = {
  title: 'Infraestructura de Inteligencia Artificial del Unicornio Solitario',
  overview: {
    title: 'Visión General',
    icon: BrainCircuit,
    text: 'El modelo del Unicornio Solitario no es solo una metáfora inspiradora: es una arquitectura tecnológica real y operativa. Cada proyecto dentro del ecosistema cuenta con una infraestructura de inteligencia artificial propia, optimizada para escalar, automatizar y generar valor con una intervención humana mínima.',
  },
  architecture: {
    title: 'Arquitectura de IA por Niveles',
    icon: Layers,
    levels: [
      {
        level: 1,
        name: 'IA por Proyecto',
        description: 'Cada idea tiene su propio LLM (modelo de lenguaje) personalizado, entrenado con datos específicos del sector.',
        functions: ['Comunicación', 'Atención al cliente', 'Generación de contenido', 'Automatización operativa'],
        icon: Lightbulb,
      },
      {
        level: 2,
        name: 'IA por Usuario',
        description: 'Cada usuario cuenta con una IA que analiza su evolución, preferencias y decisiones.',
        functions: ['Coaching personalizado', 'Recomendaciones estratégicas', 'Seguimiento de evolución personal'],
        icon: Users,
      },
      {
        level: 3,
        name: 'IA por Nodo (Hub o Institución)',
        description: 'Cada nodo territorial o institucional tiene una IA que gestiona sus proyectos, métricas y relaciones.',
        functions: ['Gestión de portafolio', 'Medición de impacto', 'Coordinación con el ecosistema'],
        icon: Target,
      },
      {
        level: 4,
        name: 'IA por Mentor',
        description: 'Los mentores disponen de una IA que recoge sus conocimientos, experiencias y estilos de acompañamiento.',
        functions: ['Matching inteligente con proyectos', 'Recomendaciones de evolución', 'Asesoría autónoma'],
        icon: BookOpen,
      },
      {
        level: 5,
        name: 'IA por Inversor',
        description: 'Cada inversor tiene un panel personalizado con IA que simula escenarios y sugiere proyectos según su perfil.',
        functions: ['Análisis de riesgo', 'Proyección de retorno', 'Simulaciones de equity'],
        icon: TrendingUp,
      },
      {
        level: 6,
        name: 'IA por Emprendedor',
        description: 'El emprendedor cuenta con una IA que actúa como copiloto estratégico.',
        functions: ['Organización de tareas', 'Seguimiento de KPIs', 'Roadmap personalizado', 'Generación de ideas'],
        icon: Brain,
      },
      {
        level: 7,
        name: 'IA por Gran Empresa',
        description: 'Permite a las grandes corporaciones gestionar sus propias incubadoras de innovación y proyectos de intraemprendimiento.',
        functions: ['Gestión de portfolio de innovación', 'Métricas de intraemprendimiento', 'Conexión con startups', 'Scouting tecnológico'],
        icon: Building,
      },
      {
        level: 8,
        name: 'IA por Proyecto Social',
        description: 'Herramientas de IA para que ONGs y entidades sociales midan su impacto, optimicen recursos y conecten con financiadores.',
        functions: ['Medición de KPIs de impacto (SROI)', 'Optimización de fundraising', 'Gestión de voluntarios', 'Reporting para donantes'],
        icon: HeartHandshake,
      },
      {
        level: 9,
        name: 'IA de Retos',
        description: 'Motor de IA dedicado a la creación, lanzamiento y seguimiento de retos temáticos dentro del ecosistema.',
        functions: ['Análisis de tendencias para retos', 'Matching de emprendedores a retos', 'Seguimiento de soluciones', 'Generación de informes de reto'],
        icon: Trophy,
      }
    ],
  },
  dataset: {
    title: 'Dataset Vivo y Evolutivo',
    icon: Database,
    text: 'Toda esta inteligencia está interconectada con un dataset global que recopila datos reales de proyectos, iteraciones, resultados, métricas de impacto, perfiles de usuarios, algoritmos entrenados y simulaciones. Este dataset mejora con cada interacción, alimentando la inteligencia colectiva del sistema.',
  },
  mareNostrum: {
    title: 'Conectividad con MareNostrum',
    icon: Cpu,
    text: 'Esta infraestructura está diseñada para integrarse con MareNostrum 5, uno de los superordenadores más potentes de Europa, a través de la AI Factory de Barcelona. Esta conexión permite:',
    features: [
      'Entrenamiento masivo de modelos propios (LLMs, modelos generativos).',
      'Ejecución de algoritmos complejos y simulaciones a gran escala en tiempo récord.',
      'Desarrollo de nuevas arquitecturas algorítmicas y IA generativa avanzada.',
      'Supervisión y orquestación de IA generalizada en proyectos de alto valor.',
    ],
  },
  maturityStages: {
    title: 'Etapas de Madurez Tecnológica y Evolución de la IA',
    icon: Zap,
    stages: [
      {
        name: 'Fase Semilla: LLMs y IA Conversacional',
        description: 'LLM básico para estructuración de ideas, chatbots y asistentes iniciales. Comienza la IA de propósito.',
        color: 'bg-green-700/30',
      },
      {
        name: 'Fase Pegaso: Agentes Autónomos y LLMs Generativos',
        description: 'MVP con al menos un agente autónomo funcional. LLMs generativos para creación de contenido y prototipado.',
        color: 'bg-blue-700/30',
      },
      {
        name: 'Fase Dragón: IA Creativa y Arquitectura Algorítmica Propia',
        description: 'Desarrollo de algoritmos propietarios. IA creativa para nuevas líneas de producto y expansión de servicios. IA que aprende y se adapta.',
        color: 'bg-orange-700/30',
      },
      {
        name: 'Fase Unicornio: Superautomatización y Sistemas Autónomos',
        description: 'Empresa como organismo autónomo orquestado por IA nativa. Conectividad global y uso intensivo de supercomputación (MareNostrum) para la IA generalizada.',
        color: 'bg-purple-700/30',
      },
    ],
  },
  expectedImpact: {
    title: 'Impacto Esperado y Ahorros',
    icon: CheckCircle,
    points: [
      'Reducción de tareas manuales y operativas en más del 90%, permitiendo a los equipos centrarse en la estrategia y la innovación.',
      'Creación de empresas valoradas entre 10M€ y más de 1.000M€ con equipos humanos mínimos y altamente eficientes.',
      'Democratización del emprendimiento de alto impacto con IA, accesible para cualquier persona, institución o territorio.',
      'Generación de un nuevo modelo económico: humano en su propósito, inteligente en su operativa y automatizado en su ejecución.',
      'Ahorros significativos en costes de desarrollo, marketing, ventas y operaciones a través de la IA.',
    ],
  },
};
