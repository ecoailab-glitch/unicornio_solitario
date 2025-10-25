export const projectActions = (dispatch) => ({
  addProject: (project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  },
  updateProject: (id, updates) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates } });
  },
  addAlertToProject: (projectId, alert) => {
    dispatch({ type: 'ADD_ALERT', payload: { projectId, alert } });
  },
  recordMentorAction: (projectId, actionType, details = {}) => {
    const newAction = {
      id: `action-${Date.now()}`,
      type: actionType,
      timestamp: new Date().toISOString(),
      details,
    };
    dispatch({ type: 'UPDATE_PROJECT', payload: { 
      id: projectId, 
      updates: { 
        mentorActionHistory: (project) => [newAction, ...(project.mentorActionHistory || [])],
        mentorInteractions: (project) => (project.mentorInteractions || 0) + 1,
      }
    }});
  },
});