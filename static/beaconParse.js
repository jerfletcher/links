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
            trimBeacons(index, 'resultTable')
        });
    }
    );
}

function parseBeacon(textData, resultId) {
    const text = textData
    const result = document.getElementById(resultId);
    beacons.push(adobeAAM_parseParams(text))
    result.innerHTML = jsonToTable(beacons).outerHTML;
    setupDelete()
}
function trimBeacons(index, resultId) {
    const result = document.getElementById(resultId);
    beacons.pop(index);
    result.innerHTML = jsonToTable(beacons).outerHTML;
    setupDelete()
}
var beacons = []
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey || event.metaKey) {
      if (String.fromCharCode(event.which).toLowerCase() === 'v') {
        const pastebin = document.getElementById('pasteBin');
        pastebin.innerHTML = '';
        pastebin.focus();
      }
    }
  });
document.getElementById('pasteBin').addEventListener('paste', (event) => {
    var clipboardData = event.clipboardData.getData("text/plain");

    parseBeacon(clipboardData, 'resultTable')
});

//harfile stuff
function processHarFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const harData = JSON.parse(event.target.result);
        displayHarData(harData);
    };
    reader.readAsText(file);
}

function displayHarData(harData) {
    const beaconList = document.getElementById('beaconList');
    let urls = [];
    harData['log']['entries'].forEach(entry => {
        const url = entry['request']['url'];
        urls.push(url);
    });

    const filterInput = document.getElementById('filterInput');

    filterInput.addEventListener('input', function () {
        const filterValue = filterInput.value.toLowerCase();

        const filteredUrls = urls.filter(url => url.toLowerCase().includes(filterValue));

        beaconList.innerHTML = '';

        filteredUrls.forEach(url => {
            const entry = document.createElement('span');
            entry.className = 'urlEntry';
            entry.textContent = url;
            entry.addEventListener('click',() => {parseBeacon(url,'resultTable')})
            beaconList.appendChild(entry);
        });
    });

    urls.forEach(url => {
        const entry = document.createElement('span');
        entry.className = 'urlEntry';
        entry.textContent = url;
        beaconList.appendChild(entry);
    });
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.name.endsWith('.har')) {
        processHarFile(file);
    } else {
        alert('Invalid file format. Please drop a .har file.');
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

// Add event listeners
const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('drop', handleDrop);
dropArea.addEventListener('dragover', handleDragOver);