const GEMINI_API_KEY_PLACEHOLDER = "TU_API_KEY_DE_GEMINI_AQUI";

const simulateApiResponse = (prompt, delay = 1500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let responseText = "Respuesta simulada de la IA: ";
      if (prompt.includes("advice_mode: 'social'")) {
        responseText = JSON.stringify({
          fit_summary: "El proyecto 'Agua para el Sahel' tiene un alto potencial de impacto directo y medible. Se alinea perfectamente con las necesidades humanitarias básicas y tiene una teoría del cambio clara y concisa.",
          sdg_alignment: [
            { id: 6, name: 'Agua Limpia y Saneamiento', score: 0.95 },
            { id: 1, name: 'Fin de la Pobreza', score: 0.75 },
            { id: 3, name: 'Salud y Bienestar', score: 0.80 }
          ],
          impact_kpis: [
            { name: "Reducción de enfermedades hídricas", target: "-80%", unit: "%" },
            { name: "Tasa de escolarización infantil", target: "+15%", unit: "%" },
            { name: "Pozos funcionales", target: "20", unit: "unidades" }
          ],
          funding_routes: [
            { type: "Subvención", name: "AECID Proyectos de Innovación", relevance: 0.9 },
            { type: "Donante privado", name: "Fundación Bill y Melinda Gates", relevance: 0.7 },
            { type: "Crowdfunding", name: "Campaña en GoFundMe", relevance: 0.6 }
          ],
          risks: [
            { name: "Sostenibilidad a largo plazo", mitigation: "Crear comités locales de agua y formar a técnicos para el mantenimiento." },
            { name: "Inestabilidad política", mitigation: "Establecer acuerdos con líderes comunitarios y ONGs locales." }
          ],
          next_steps: ["Finalizar el estudio de viabilidad geotécnica.", "Lanzar una campaña de crowdfunding inicial.", "Presentar la propuesta a AECID."],
          score: { pegasus: 0, impact_readiness: 8.5 }
        }, null, 2);
      } else if (prompt.includes("pasión") || prompt.includes("propósito")) {
        responseText += "He analizado tu pasión. Parece que te inclinas por proyectos con impacto social y creativo. Podrías explorar ideas en educación tecnológica o arte digital sostenible.";
      } else if (prompt.includes("problema") || prompt.includes("resolver")) {
        responseText += "Ese es un desafío interesante. Podríamos enfocarlo desde una perspectiva de economía circular o utilizando IA para optimizar recursos. Tres ideas de negocio podrían ser: una plataforma de intercambio de habilidades, un sistema de logística urbana eficiente, o una app para reducir el desperdicio alimentario.";
      } else if (prompt.includes("experiencia")) {
        responseText += "Tu experiencia en [sector mencionado por el usuario, si lo hay, o genérico 'ese sector'] es muy valiosa. Podemos combinarla con las últimas tendencias en IA para crear algo único.";
      } else if (prompt.includes("impacto")) {
        responseText += "Generar un impacto positivo es fundamental. Tu visión podría materializarse ayudando a [número] personas o comunidades en los próximos [tiempo] años.";
      } else if (prompt.includes("visión")) {
        responseText += "Una visión ambiciosa pero alcanzable. Para llegar allí, necesitaremos enfocarnos en [hito 1], [hito 2] y [hito 3].";
      } else if (prompt.toLowerCase().includes("generar mensaje institucional")) {
        responseText = `🚀 Actualización del Ecosistema Unicornio Solitario (Simulado con IA)

¡Hola Equipo! Soy el Asistente IA de Unicornio Solitario, bajo la dirección de José Luis Nieto.

📈 Este mes hemos visto un crecimiento notable:
• X nuevos proyectos en fase Semilla.
• Y proyectos han avanzado a fase Pegaso.
• Se han movilizado Z€ en financiación inicial.

💡 Destacado: [Nombre Proyecto Destacado] está mostrando gran tracción en [Sector].

¡Sigamos impulsando la innovación! 🦄

Atentamente,
Tu Asistente IA del Ecosistema`;
      } else if (prompt.toLowerCase().includes("analiza el proyecto") && prompt.toLowerCase().includes("alerta")) {
        const projectName = prompt.match(/Analiza el proyecto (.*?) en fase/i)?.[1] || "este proyecto";
        const projectStatus = prompt.match(/alerta: (.*?)\./i)?.[1] || "una situación particular";
        responseText = `Análisis IA para ${projectName} (Alerta: ${projectStatus}):
- **Causa Raíz Probable:** ${Math.random() > 0.5 ? "Desalineación con el mercado objetivo." : "Falta de iteración rápida basada en feedback."}
- **Impacto Potencial:** ${Math.random() > 0.3 ? "Estancamiento en la captación de usuarios." : "Pérdida de ventaja competitiva."}
- **Sugerencia Clave:** ${Math.random() > 0.6 ? "Realizar entrevistas con 10 clientes potenciales esta semana." : "Pivotar la propuesta de valor hacia el segmento X."}
- **Recurso Útil:** Enlace a [Framework de Validación de Ideas] o [Plantilla de Lean Canvas].`;
      } else if (prompt.toLowerCase().includes("sugerencia de apoyo para") && prompt.toLowerCase().includes("basada en")) {
        const projectName = prompt.match(/Sugerencia de apoyo para (.*?) basada en/i)?.[1] || "el proyecto";
        const mentorConcern = prompt.match(/basada en: (.*)/i)?.[1] || "la preocupación del mentor";
        responseText = `Sugerencia de Mensaje para ${projectName} (basado en: "${mentorConcern}"):
"Hola [Nombre Emprendedor],

He estado revisando el progreso de ${projectName} y, considerando tu feedback sobre '${mentorConcern}', me gustaría sugerirte que exploremos juntos [acción específica como 'redefinir el pitch' o 'analizar nuevas métricas de tracción'].

Podríamos enfocarnos en [beneficio esperado de la acción]. ¿Te parece si agendamos una breve charla para discutirlo?

¡Ánimo y seguimos adelante!

Saludos,
José Luis Nieto (vía Asistente IA)"`;
      } else {
        responseText += `Procesando tu solicitud sobre "${prompt.substring(0, 50)}...". He identificado varias oportunidades y recursos relevantes.`;
      }
      resolve({ success: true, data: responseText });
    }, delay);
  });
};

export const getAiAdvice = async (project, adviceMode = 'startup') => {
  console.log(`Pidiendo consejo IA para ${project.nombre} en modo ${adviceMode}`);
  const prompt = `Project: ${project.nombre}, Description: ${project.descripcion}, advice_mode: '${adviceMode}'`;
  // Aquí no retornamos el hash, lo hacemos fuera
  return simulateApiResponse(prompt);
};


export const getAiGuidanceForEmprendedor = async (prompt) => {
  console.log("Enviando a IA (simulado):", prompt);
  return simulateApiResponse(prompt);
};

export const getAiChatResponse = async (prompt, userType) => {
  console.log(`Enviando a IA Chat (simulado) para ${userType}:`, prompt);
  let tailoredPrompt = prompt;
  if (userType === "nodo") {
    tailoredPrompt = `Como nodo, necesito ayuda con: ${prompt}`;
  } else if (userType === "emprendedor") {
    tailoredPrompt = `Como emprendedor, mi consulta es: ${prompt}`;
  } else if (userType === "mentor") {
    tailoredPrompt = `Como mentor, busco información sobre: ${prompt}`;
  } else if (userType === "inversor") {
    tailoredPrompt = `Como inversor, me interesa: ${prompt}`;
  }
  return simulateApiResponse(tailoredPrompt);
};


export const generateInstitutionalMessageWithAI = async (nodeInfo) => {
  console.log("Generando mensaje institucional con IA (simulado) para:", nodeInfo.nombre);
  const prompt = `generar mensaje institucional para ${nodeInfo.nombre} de ${nodeInfo.ciudad}`;
  return simulateApiResponse(prompt);
};


export const analyzeProjectWithAI = async (project) => {
  console.log("Analizando proyecto con IA (simulado):", project.nombre);
  const prompt = `Analiza el proyecto ${project.nombre} en fase ${project.fase} del sector ${project.sector}. Potencial, riesgos y sugerencias.`;
  return simulateApiResponse(prompt, 2000);
};

export const getProjectAlertDetailsAI = async (project, alertContext) => {
  console.log("Obteniendo detalles de alerta IA (simulado) para:", project.nombre, "Contexto:", alertContext);
  const prompt = `Analiza el proyecto ${project.nombre} en fase ${project.fase}. Contexto de alerta: ${alertContext}. Proporciona causas probables, impacto y sugerencias.`;
  return simulateApiResponse(prompt, 1800);
};

export const getMentorSupportSuggestionAI = async (project, mentorConcern) => {
  console.log("Obteniendo sugerencia de apoyo IA (simulado) para:", project.nombre, "Preocupación:", mentorConcern);
  const prompt = `Sugerencia de apoyo para ${project.nombre} basada en: ${mentorConcern}. Genera un borrador de email o mensaje.`;
  return simulateApiResponse(prompt, 2200);
};

// Función para simular la creación de un hash
export const simpleHash = async (text) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 16); // Acortar para visualización
  }
  // Fallback para entornos sin crypto.subtle
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; 
  }
  return `fb_${(hash >>> 0).toString(16)}`;
};