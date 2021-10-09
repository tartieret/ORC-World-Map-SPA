const URL = 'https://docs.google.com/spreadsheets/d/1wCkMtyLMCsLfRQv49NWKu7SN4OASgH-aw2TrFxOtDVQ/gviz/tq?tqx=out:json';

function convertResponseToJSON(text) {
    return JSON.parse(text.substr(47).slice(0, -2))
}

function formatSheetData(json) {
    const data = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */

    console.log(json);
    const headers = json.table.cols.map(obj => obj.label).filter(label => label !== "");
    console.log("Headers", headers);
    const rows = json.table.rows;

    for (const row of rows) {
        let item = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (row.c[i] !== null) {
                item[header] = row.c[i].v;
            } else {
                item[header] = null;
            }

        }
        data.push(item);
    }
    return data;
}

/**
 * Load list of projects from Google Sheet
 */
// function loadProjects({ commit }) {
export function loadProjects() {
    return new Promise((resolve, reject) => {

        fetch(URL)
            .then(res => res.text())
            .then(text => convertResponseToJSON(text))
            .then(json => {
                const data = formatSheetData(json);
                console.log(data);
                resolve(data);
            })
            .catch(error => {
                console.error('Failed to projects: ', error);
                reject(error);
            });
    });
}

