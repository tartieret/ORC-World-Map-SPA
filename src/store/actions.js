const URL = 'https://docs.google.com/spreadsheets/d/1wCkMtyLMCsLfRQv49NWKu7SN4OASgH-aw2TrFxOtDVQ/gviz/tq?tqx=out:json';

function parseResponse(text) {
    return JSON.parse(text.substr(47).slice(0, -2))
}

/**
 * Load list of projects from Google Sheet
 */
// function loadProjects({ commit }) {
function loadProjects() {
    return new Promise((resolve, reject) => {

        fetch(URL)
            .then(res => res.text())
            .then(text => parseResponse(text))
            .then(json => {
                console.log(json);
                resolve(true);
            })
            .catch(error => {
                console.error('Failed to projects: ', error);
                reject(error);
            });
    });
}


export default {
    loadProjects
}