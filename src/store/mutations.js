/**
 * Add project to store.
 * @param {Object} project
 */
function ADD_PROJECT(state, project) {
    state.projects.push(project);
}

export default {
    ADD_PROJECT
}
