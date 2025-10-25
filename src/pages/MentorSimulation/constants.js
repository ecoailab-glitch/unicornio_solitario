
import { Lightbulb, Rocket, Award, Activity, Gem, TrendingUp, CheckCircle, AlertTriangle, Brain, Cpu, Users, Compass } from 'lucide-react';

export const mariaAlonsoData = {
  nombreCompleto: 'José Luis Nieto',
  nodo: 'Menttoriza',
  cargo: 'Director y Arquitecto del Ecosistema',
  incorporacion: 'Enero 2024',
  rankingMentorRegional: '#1 en red global Unicornio Solitario',
  proyectosActuales: {
    total: 12,
    semilla: 5,
    pegaso: 4,
    dragon: 2,
    unicornio: 1,
  },
};

export const initialProjects = [
  {
    id: 'proj_1_JLN',
    nombre: 'AgroTech Sostenible',
    creador: 'Laura Gómez',
    fase: 'Pegaso',
    sector: 'Agricultura',
    region: 'Málaga',
    descripcion: 'Plataforma IA para optimizar el uso de recursos hídricos en la agricultura y reducir el impacto ambiental.',
    ia: 'Gemini Pro',
    agentes: ['Análisis de datos', 'Predicción de cosechas'],
    mentor: 'José Luis Nieto',
    impacto: 'Reducción del 20% en consumo de agua',
    documentos: ['Plan de negocio V2', 'Pitch deck inversores'],
    financiacionCaptada: 750000,
    valorEstimado: 2000000,
    beneficioEstimadoMentor: 100000,
    lastFundingDate: new Date(2024, 10, 15).toISOString(),
    expectedMonthlyRevenue: 15000,
    currentMonthlyRevenue: 8000,
    progressStatus: 'needs_attention', 
    mentorInteractions: 5,
    deliveriesCompleted: 12,
  },
  {
    id: 'proj_2_JLN',
    nombre: 'Salud Conectada IA',
    creador: 'Carlos Ruiz',
    fase: 'Dragón',
    sector: 'Salud',
    region: 'Málaga',
    descripcion: 'Sistema de diagnóstico asistido por IA para enfermedades raras, mejorando la velocidad y precisión.',
    ia: 'Vertex AI',
    agentes: ['Procesamiento de imágenes médicas', 'Análisis genómico'],
    mentor: 'José Luis Nieto',
    impacto: 'Diagnóstico temprano en +500 pacientes',
    documentos: ['Estudio clínico fase II', 'Patente modelo IA'],
    financiacionCaptada: 3200000,
    valorEstimado: 15000000,
    beneficioEstimadoMentor: 750000,
    lastFundingDate: new Date(2025, 0, 20).toISOString(),
    expectedMonthlyRevenue: 60000,
    currentMonthlyRevenue: 65000,
    progressStatus: 'exceeding_expectations',
    mentorInteractions: 12,
    deliveriesCompleted: 25,
  },
  {
    id: 'proj_3_JLN',
    nombre: 'Turismo Regenerativo Costa',
    creador: 'Sofía Navarro',
    fase: 'Semilla',
    sector: 'Turismo',
    region: 'Málaga',
    descripcion: 'App para conectar viajeros con experiencias turísticas locales que promueven la conservación y cultura.',
    ia: 'Agente IA Básico',
    agentes: ['Recomendador personalizado', 'Gestor de reservas'],
    mentor: 'José Luis Nieto',
    impacto: 'Promoción de 50+ negocios locales sostenibles',
    documentos: ['MVP funcional', 'Estudio de mercado'],
    financiacionCaptada: 80000,
    valorEstimado: 300000,
    beneficioEstimadoMentor: 15000,
    lastFundingDate: new Date(2025, 4, 5).toISOString(),
    expectedMonthlyRevenue: 3000,
    currentMonthlyRevenue: 1000,
    progressStatus: 'at_risk',
    mentorInteractions: 2,
    deliveriesCompleted: 4,
  },
  {
    id: 'proj_4_JLN',
    nombre: 'Educación Inmersiva Futura',
    creador: 'David Jiménez',
    fase: 'Pegaso',
    sector: 'Educación',
    region: 'Málaga',
    descripcion: 'Plataforma de aprendizaje con Realidad Virtual y Aumentada para formación técnica especializada.',
    ia: 'LLM especializado',
    agentes: ['Creador de escenarios VR', 'Tutor IA personalizado'],
    mentor: 'José Luis Nieto',
    impacto: 'Formación de +1000 técnicos cualificados',
    documentos: ['Prototipo VR funcional', 'Acuerdos con centros FP'],
    financiacionCaptada: 550000,
    valorEstimado: 1800000,
    beneficioEstimadoMentor: 90000,
    lastFundingDate: new Date(2024, 8, 10).toISOString(),
    expectedMonthlyRevenue: 12000,
    currentMonthlyRevenue: 13500,
    progressStatus: 'on_track',
    mentorInteractions: 8,
    deliveriesCompleted: 15,
  }
];

export const simulacionAnualData = [
  { ano: 'Año 2025', proyectosActivos: '5 Semilla, 2 Pegaso', financiacionMovida: '450.000 €', beneficioTotalSimulado: '15.000 €' },
  { ano: 'Año 2026', proyectosActivos: '+3 Pegaso, 1 Dragón', financiacionMovida: '2.100.000 €', beneficioTotalSimulado: '255.000 €' },
  { ano: 'Año 2027', proyectosActivos: '+2 Dragón, 1 Unicornio', financiacionMovida: '8.800.000 €', beneficioTotalSimulado: '770.000 €' },
  { ano: 'Año 2028', proyectosActivos: '3 Dragón, 2 Unicornio', financiacionMovida: '12.000.000 €', beneficioTotalSimulado: '2.400.000 €' },
  { ano: 'Año 2029', proyectosActivos: '2 Dragón, 3 Unicornio', financiacionMovida: '8.000.000 €', beneficioTotalSimulado: '4.000.000 €' },
];

export const totalAcumulado5Anos = simulacionAnualData.reduce((sum, item) => {
    const beneficio = parseFloat(item.beneficioTotalSimulado.replace(/[.€ ]/g, '').replace(',', '.'));
    return sum + beneficio;
}, 0);

export const simulacionAltoImpactoData = [
  { concepto: 'Equity acumulado de 3 unicornios', proyeccion: '60–90 M €', icon: TrendingUp, color: "text-pink-400" },
  { concepto: 'Márgenes industriales en 70 proyectos', proyeccion: '40–60 M €', icon: Award, color: "text-orange-400" },
  { concepto: 'Bonus y licencias nodo global', proyeccion: '10–15 M €', icon: Gem, color: "text-teal-400" },
  { concepto: 'Representación e influencia global', proyeccion: 'Incuantificable', icon: Activity, color: "text-sky-400" },
];
export const totalPosibleAltoImpacto = '+200 M €';

export const fasesEvolucionData = [
  { 
    fase: '🌱 Fase Semilla', 
    subtitulo: 'Ideas iniciales con potencial',
    descripcion: 'En esta primera fase ayudamos a que el emprendedor conecte con su propósito vital, sus fortalezas y su visión. Aquí nacen las primeras ideas y se ofrece mentoría + IA para definir una propuesta con impacto real.',
    puntosClave: [
      'Apoyo en habilidades blandas, autoconocimiento y diseño de propósito',
      'Ayudas públicas de entre 60.000 y 100.000 € (ej. Finnova, Junta, Erasmus+)',
      'IA que acompaña desde el día 1 para ayudar a estructurar visión y modelo de negocio'
    ],
    cita: '"Aquí nace el alma del proyecto."',
    colorClasses: 'bg-emerald-600/20 border-emerald-500 text-emerald-300',
    icon: Lightbulb,
    textColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500',
  },
  { 
    fase: '🟦 Fase Pegaso', 
    subtitulo: 'Proyectos en crecimiento',
    descripcion: 'El proyecto ya tiene un MVP real, con su propia IA generativa y al menos un agente autónomo funcional. Se establece una valoración estimada de 10 M € y se libera el 40% del equity no diluible para captar 4 M € en inversión semilla.',
    puntosClave: [
      'Participan bancos como SafeBrok, inversores minoristas, ayudas CDTI y fondos regionales',
      'Equipo técnico de Devol, mentores de Menttoriza y alianzas institucionales',
      'Validación con usuarios reales y prototipo experimental en funcionamiento'
    ],
    cita: '"El Pegaso despega con alas de IA."',
    colorClasses: 'bg-blue-600/20 border-blue-500 text-blue-300',
    icon: Rocket,
    textColor: 'text-blue-300',
    bgColor: 'bg-blue-500',
  },
  { 
    fase: '🟧 Fase Dragón', 
    subtitulo: 'Startups escalables',
    descripcion: 'La empresa está ya en el mercado, con clientes, ingresos y una arquitectura algorítmica propia. Se alcanza una valoración de 100 M € y se vuelve a activar un 40% del equity, esta vez diluible, para captar 40 M € en inversión.',
    puntosClave: [
      'Entrada de family offices, venture capital, fondos EIC o CVC (corporate VC)',
      'IA creativa genera nuevas líneas de producto y expansión de servicios',
      'Se prepara la empresa para internacionalizarse y consolidarse'
    ],
    cita: '"El Dragón no solo vuela, también crea."',
    colorClasses: 'bg-orange-600/20 border-orange-500 text-orange-300',
    icon: Award,
    textColor: 'text-orange-300',
    bgColor: 'bg-orange-500',
  },
  { 
    fase: '🟪 Fase Unicornio', 
    subtitulo: 'Empresas valoradas en +$1B',
    descripcion: 'La empresa se convierte en un organismo autónomo, sin necesidad de estructura humana, orquestado por una IA nativa y agentes interconectados.',
    puntosClave: [
      'Ya no se diluye más equity: el valor está en la salida a bolsa, licencias o adquisiciones',
      'La empresa es capaz de operar, innovar, vender y escalar sin intervención humana',
      'Todo está conectado con sistemas de alto rendimiento como MareNostrum, el superordenador de Barcelona, que entrena los algoritmos y simula la evolución de los proyectos'
    ],
    cita: '"Aquí nace la era algorítmica: empresas conscientes, autónomas y exponenciales."',
    colorClasses: 'bg-purple-600/20 border-purple-500 text-purple-300',
    icon: Gem,
    textColor: 'text-purple-300',
    bgColor: 'bg-purple-600',
  }
];

export const mareNostrumInfo = {
  titulo: '⚙️ MareNostrum y la Era Algorítmica',
  descripcion: 'A partir de la Fase Dragón, los proyectos del Unicornio Solitario pueden conectarse a infraestructura de supercomputación a través de alianzas con la AI Factory de Barcelona y MareNostrum 5.',
  puntosClave: [
    'Entrenamiento de modelos propios (LLMs, agentes financieros, médicos, legales...)',
    'Simulación de impacto económico y social en múltiples escenarios',
    'Generación de nuevas estrategias a partir de algoritmos evolutivos'
  ],
  cita: '"No solo automatizamos. Creamos inteligencia que evoluciona con cada decisión."',
  icon: Cpu,
};

export const dondeEstasTuInfo = {
  titulo: '🚀 ¿Dónde estás tú en este viaje?',
  descripcion: 'Desde Impact Hub, una universidad o como emprendedor, puedes formar parte del camino desde la Semilla hasta la Superautomatización.',
  cita: 'La tecnología está lista. Lo que falta es que tú digas: "Sí, quiero ser un Unicornio Solitario."',
  icon: Compass,
};


export const tecnologiaFinancieraData = [
  { fase: 'Hoja en blanco', icon: Lightbulb, color: 'text-purple-400', tecnologia: 'LLM + Test propósito + agente IA', valorEmpresa: '—', financiacion: 'Ayuda pública 60–100K €', retornoMaria: '1–2 K € por proyecto' },
  { fase: 'Pegaso', icon: Rocket, color: 'text-blue-400', tecnologia: 'LLM + RPA + agentes básicos', valorEmpresa: '10 M €', financiacion: '4 M € (equity fijo)', retornoMaria: '~200 K € / proyecto' },
  { fase: 'Dragón', icon: Award, color: 'text-orange-400', tecnologia: 'IA creativa + arquitecturas', valorEmpresa: '100 M €', financiacion: '40 M € (equity diluible)', retornoMaria: '~1 M € / proyecto' },
  { fase: 'IA Virtual', icon: Activity, color: 'text-teal-400', tecnologia: 'Agentes autónomos y algoritmos', valorEmpresa: '—', financiacion: 'No requiere ronda', retornoMaria: 'Revalorización' },
  { fase: 'Unicornio', icon: Gem, color: 'text-pink-400', tecnologia: 'Súperautomatización total', valorEmpresa: '+1.000 M €', financiacion: 'Salida a bolsa/licencias', retornoMaria: '3–10 M € por unicornio' },
];


export const progressStatuses = {
  on_track: { label: "En Progreso", color: "text-green-400", icon: CheckCircle },
  needs_attention: { label: "Necesita Atención", color: "text-yellow-400", icon: AlertTriangle },
  at_risk: { label: "En Riesgo", color: "text-red-400", icon: AlertTriangle },
  exceeding_expectations: { label: "Superando Expectativas", color: "text-teal-400", icon: TrendingUp }
};
