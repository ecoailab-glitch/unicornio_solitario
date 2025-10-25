export const projectSelectors = (state) => ({
  getProjectsByPhase: (fase) => {
    if (!state || !state.projects) return [];
    return state.projects.filter(project => project.fase === fase);
  },

  getProjectsBySector: (sector) => {
    if (!state || !state.projects) return [];
    return state.projects.filter(project => project.sector === sector);
  },

  getProjectById: (id) => {
    if (!state || !state.projects) return undefined;
    return state.projects.find(project => project.id === id);
  }
});