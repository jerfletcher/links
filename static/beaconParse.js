const adobeAAM_parseParams = function (params) {
    const paramsObj = new URLSearchParams(params);
    const result = {};
    let prefix = '';
    for (const [key, value] of paramsObj.entries()) {
        if (/\.$/.test(key)) {
            prefix = key;
        } else if (/^\./.test(key)) {
            prefix = '';
        } else result[prefix + key] = value;
    }
    return result;
};

function jsonToTable(json) {

    const table = document.createElement('table');
    if (json.length === 0) { return table; };
    // create table headers for object index and event names
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerCell1 = document.createElement('th');
    headerCell1.textContent = 'Keys'
    headerRow.appendChild(headerCell1); // empty header cell keys column
    json.forEach((key, index) => {
        const headerCell = document.createElement('th');
        headerCell.innerHTML = `${(index + 1)}<span class="colDelete" data-col-index="${index}">X<span>`;
        headerRow.appendChild(headerCell);
    });
    header.appendChild(headerRow);
    table.appendChild(header);

    // create table rows for each property in the objects
    const propertyKeys = Object.keys(json[0]).sort(); // sort properties for consistency
    propertyKeys.forEach(key => {
        const row = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.textContent = key;
        row.appendChild(rowHeader);
        Object.values(json).forEach(object => {
            const cell = document.createElement('td');
            cell.textContent = object[key] || '-';
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    // add Material UI table classes
    table.classList.add('mui-table', 'mui-table--bordered', 'mui--text-body2');

    return table;
}

function setupDelete() {
    document.querySelectorAll('.colDelete').forEach(el => {
        el.addEventListener("click", (event) => {
            console.log('here');
            const index = event.target.getAttribute('data-colIndex')
            trimBeacons(index, 'result')
        });
    }
    );
}

function parseBeacon(srcId, resultId, textData) {
    const text = textData || document.getElementById(srcId).value;
    const result = document.getElementById(resultId);
    beacons.push(adobeAAM_parseParams(text))
    result.innerHTML = jsonToTable(beacons).outerHTML;
    setupDelete()
    //reset text
    setTimeout(() => {
        document.getElementById(srcId).value = '';
    }, 1)

}
function trimBeacons(index, resultId) {
    const result = document.getElementById(resultId);
    beacons.pop(index);
    result.innerHTML = jsonToTable(beacons).outerHTML;
    setupDelete()
}
var beacons = []

document.getElementById('button').addEventListener('click', () => {
    parseBeacon('beacon', 'result')
});
document.getElementById('beacon').addEventListener('paste', (event) => {
    var clipboardData = event.clipboardData.getData("text/plain");

    parseBeacon('beacon', 'result', clipboardData)
});