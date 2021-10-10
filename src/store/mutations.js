/**
 * Add project to store.
 * @param {Object} project
 */
function ADD_PROJECT(state, project) {
    state.projects.push(project);
}

function SET_PROJECTS(state, projects) {
    state.projects = projects;
}

export default {
    ADD_PROJECT,
    SET_PROJECTS,
}
