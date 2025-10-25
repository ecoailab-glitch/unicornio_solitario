import { initialProjectsData } from './projectInitialData';

export const projectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT': {
      const newProject = {
        ...action.payload,
        id: Date.now().toString(),
        fechaCreacion: new Date().toISOString(),
        financiacionCaptada: action.payload.financiacionCaptada || 0,
        valorEstimado: action.payload.valorEstimado || 0,
        beneficioEstimadoMentor: action.payload.beneficioEstimadoMentor || 0,
        lastFundingDate: new Date().toISOString(),
        expectedMonthlyRevenue: action.payload.expectedMonthlyRevenue || 0,
        currentMonthlyRevenue: action.payload.currentMonthlyRevenue || 0,
        progressStatus: action.payload.progressStatus || 'on_track',
        mentorInteractions: action.payload.mentorInteractions || 0,
        entrepreneurParticipationLevel: action.payload.entrepreneurParticipationLevel || 'media',
        alerts: action.payload.alerts || [],
      };
      return { ...state, projects: [...state.projects, newProject] };
    }
    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? { ...project, ...action.payload.updates } : project
        ),
      };
    }
    case 'ADD_ALERT': {
      const newAlert = { ...action.payload.alert, id: `alert-${Date.now()}`, date: new Date().toISOString() };
      return {
        ...state,
        projects: state.projects.map(p => {
          if (p.id === action.payload.projectId) {
            return { ...p, alerts: [newAlert, ...(p.alerts || [])] };
          }
          return p;
        }),
      };
    }
    default:
      return state;
  }
};