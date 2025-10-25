export const loadProjectsFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('unicornio_projects_v2');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load projects from localStorage", error);
    return undefined;
  }
};

export const saveProjectsToStorage = (projects) => {
  try {
    const serializedState = JSON.stringify(projects);
    localStorage.setItem('unicornio_projects_v2', serializedState);
  } catch (error) {
    console.error("Could not save projects to localStorage", error);
  }
};