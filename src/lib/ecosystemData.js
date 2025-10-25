import * as LucideIcons from 'lucide-react';

export const ecosystemPillarsData = [
  {
    id: 'foundation',
    icon: 'HeartHandshake', 
    title: 'FUNDACIÓN QUE SOSTIENE EL PROPÓSITO',
    subtitle: 'Fundación Social Health',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-900/20',
    details: [
      'Motor ético del ecosistema',
      'Visión integral: IA + salud + transformación humana',
      'Base clínica: +25.000 casos reales en nutrición, obesidad, salud preventiva'
    ],
  },
  {
    id: 'tech-infra',
    icon: 'Cpu', 
    title: 'INFRAESTRUCTURA TECNOLÓGICA',
    subtitle: 'Devol Robotics Automation',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/50',
    bgColor: 'bg-orange-900/20',
    details: [
      '+140 ingenieros especializados en automatización e IA generativa',
      '+17 años de experiencia desarrollando soluciones para empresas clave del país',
      'Más del 20% del PIB empresarial español ya trabaja con soluciones Devol',
      'Clientes: Mercedes-Benz, Eroski, Mapfre, Iberdrola, Repsol, Renault, Sanitas, Grupo VASS...',
      'Ámbitos: salud, retail, industria, logística, seguros, automoción, finanzas'
    ],
    quote: '“Devol no es un proveedor. Es la columna vertebral tecnológica del Unicornio Solitario.”'
  },
  {
    id: 'mentorship-network',
    icon: 'Users',
    title: 'RED DE MENTORÍA Y COORDINACIÓN HUMANA',
    subtitle: 'Menttoriza',
    color: 'text-green-400',
    borderColor: 'border-green-500/50',
    bgColor: 'bg-green-900/20',
    details: [
      'Plataforma de mentoría e inversión con impacto social e innovación avanzada',
      '+1.000 mentores activos en Europa y América Latina',
      'Especialidades: salud, IA, educación, agroindustria, energía, emprendimiento rural'
    ],
    subsections: [
      {
        icon: 'BrainCircuit',
        title: 'Pedro Álvarez – Responsable de Inteligencia Artificial de Menttoriza',
        points: [
          'Diseña las herramientas basadas en LLMs y agentes autónomos',
          'Coordina la integración IA–mentoría–propósito humano',
          'Enlace directo entre mentoring humano e inteligencia artificial aplicada'
        ]
      }
    ],
    quote: '“Menttoriza conecta a cada emprendedor con el mentor y la IA que necesita, en cada fase.”'
  },
  {
    id: 'universities',
    icon: 'GraduationCap',
    title: 'UNIVERSIDADES Y CENTROS DE INVESTIGACIÓN',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    bgColor: 'bg-blue-900/20',
    table: [
      { Universidad: 'UMA – Málaga', Laboratorio: 'Robótica quirúrgica y social', Especialidad: 'Automatización física y emocional' },
      { Universidad: 'UPC – Barcelona', Laboratorio: 'MareNostrum / IA distribuida', Especialidad: 'LLMs propios, IA general aplicada' },
      { Universidad: 'UPM – Madrid', Laboratorio: 'Computación natural, IoT', Especialidad: 'Modelos emergentes + industrialización' },
      { Universidad: 'UV – Valencia', Laboratorio: 'IA aeroespacial y predictiva', Especialidad: 'Machine learning + sistemas visuales' },
      { Universidad: 'UB – Barcelona', Laboratorio: 'Neurociencia educativa', Especialidad: 'IA consciente + modelos adaptativos' },
    ]
  },
  {
    id: 'financial-infra',
    icon: 'Landmark',
    title: 'INFRAESTRUCTURA FINANCIERA',
    color: 'text-teal-400',
    borderColor: 'border-teal-500/50',
    bgColor: 'bg-teal-900/20',
    sections: [
      {
        subtitle: 'SafeBrok (Eva Benítez – Directora Global)',
        icon: 'ShieldCheck',
        color: 'text-blue-300',
        points: [
          'Arquitectura de inversión estructurada por fases',
          'Red de +150 asesores certificados',
          'Tokenización de equity + estructura para salida a bolsa 2025',
          'Colaboradores institucionales: Allianz, Caser, Liontrust',
        ]
      },
      {
        subtitle: 'Finnova',
        icon: 'Euro',
        color: 'text-yellow-300',
        points: [
          'Acceso directo a fondos europeos',
          'Especialistas en convocatorias Interreg, Erasmus+, NextGen, EIC Accelerator',
          'Apoyo técnico en redacción y justificación de ayudas',
        ]
      }
    ]
  },
  {
    id: 'tech-evolution',
    icon: 'TrendingUp',
    title: 'EVOLUCIÓN TECNOLÓGICA Y ESCALADO GLOBAL',
    subtitle: 'Semilla → Pegaso → Dragón → Unicornio',
    color: 'text-pink-400',
    borderColor: 'border-pink-500/50',
    bgColor: 'bg-pink-900/20',
    details: [
      'Cada fase está soportada por:',
      'IA de propósito y guía narrativa (Semilla)',
      'MVP con agentes autónomos y tokenización (Pegaso)',
      'IA creativa y algoritmos propietarios (Dragón)',
      'Superautomatización algorítmica vía MareNostrum (Unicornio)'
    ],
    quote: '“La IA no sustituye al ser humano. Lo potencia.”'
  },
  {
    id: 'institutional-support',
    icon: 'Building',
    title: 'APOYOS INSTITUCIONALES',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/50',
    bgColor: 'bg-indigo-900/20',
    details: [
      'Impact Hub Málaga (nodo oficial propuesto)',
      'Menttoriza – Red internacional de innovación',
      'Agencia TRADE – Internacionalización y conexión empresarial',
      'Red universidades + Observatorio de la Diplomacia',
      'Alianzas LATAM: asociaciones nacionales de salud, nutrición y emprendimiento'
    ]
  },
  {
    id: 'final-vision',
    icon: 'Rocket',
    title: 'VISIÓN FINAL',
    color: 'text-red-400',
    borderColor: 'border-red-500/50',
    bgColor: 'bg-red-900/20',
    details: [
      'Unicornio Solitario no es un experimento.',
      'Es un ecosistema operativo, global y real, diseñado para transformar cómo nacen, crecen y se expanden las empresas del futuro.'
    ],
    isEmphasized: true,
  }
];

export const getIconComponent = (iconName) => {
  const IconComponent = LucideIcons[iconName];
  return IconComponent || LucideIcons.HelpCircle; 
};