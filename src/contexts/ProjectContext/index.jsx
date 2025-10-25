import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialProjectsData } from './projectInitialData';
import { projectReducer } from './projectReducer';
import { loadProjectsFromStorage, saveProjectsToStorage } from './projectStorage';

const ProjectContext = createContext(null);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects debe usarse dentro de ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, { projects: initialProjectsData });

  useEffect(() => {
    const loadedProjects = loadProjectsFromStorage();
    if (loadedProjects && loadedProjects.length > 0) {
      dispatch({ type: 'SET_PROJECTS', payload: loadedProjects });
    } else {
      saveProjectsToStorage(initialProjectsData);
      dispatch({ type: 'SET_PROJECTS', payload: initialProjectsData });
    }
  }, []);

  useEffect(() => {
    if (state.projects && state.projects.length > 0) {
        saveProjectsToStorage(state.projects);
    }
  }, [state.projects]);

  const addProject = (project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  };

  const updateProject = (id, updates) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } });
  };
  
  const addAlertToProject = (projectId, alert) => {
    dispatch({ type: 'ADD_ALERT', payload: { projectId, alert } });
  };

  const getProjectsByPhase = (fase) => {
    return state.projects.filter(project => project.fase === fase);
  };

  const getProjectsBySector = (sector) => {
    return state.projects.filter(project => project.sector === sector);
  };

  const getProjectById = (id) => {
    return state.projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{
      projects: state.projects,
      addProject,
      updateProject,
      addAlertToProject,
      getProjectsByPhase,
      getProjectsBySector,
      getProjectById,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};