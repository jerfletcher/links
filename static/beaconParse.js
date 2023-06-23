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
    json.forEach((entry, index) => {
        const headerCell = document.createElement('th');
        headerCell.innerHTML = `${(index + 1)}<span class="colDelete" data-col-index="${index}">X<span>`;
        headerRow.appendChild(headerCell);
    });
    header.appendChild(headerRow);
    table.appendChild(header);

    // create table rows for each property in the objects
    let propertyKeys = []
    json.forEach((item) =>{propertyKeys = [...new Set([...propertyKeys, ...Object.keys(item)])]}); // sort properties for consistency
    propertyKeys.sort().forEach(key => {
        const row = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.textContent = key;
        row.appendChild(rowHeader);
        let rowData = [];
        Object.values(json).forEach(object => {
            rowData.push(object[key] || '-')
        });

        const rowDataCount = rowData.reduce((acc, element) => {
            if(element != '-') {
                acc[element] = (acc[element] || 0) + 1;
            }
            return acc;
          }, {});
     
        rowData.forEach(value => {
            const cell = document.createElement('td');
            if (rowDataCount[value] >= 2) {
                cell.classList.add('marked')
            }
            cell.textContent = value;
            row.appendChild(cell);
        })
        table.appendChild(row);
    });

    // add Material UI table classes
    table.classList.add('mui-table', 'mui-table--bordered', 'mui--text-body2');

    return table;
}

function setupDelete() {
    document.querySelectorAll('.colDelete').forEach(el => {
        el.addEventListener("click", (event) => {
            const index = event.target.getAttribute('data-col-index')
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
    beacons.splice(index, 1);
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
        displayHarData(harData, name);
    };
    //need to read to trigger onload
    reader.readAsText(file);
}

function displayHarData(harData) {
    const beaconList = document.getElementById('beaconList');
    let reqs = [];
    harData['log']['entries'].forEach(entry => {
        const req = entry['request'];
        reqs.push(req);
    });
    const harSection = document.createElement('div');
    harSection.id = 'URLsection1';
    const filterInput = document.getElementById('filterInput');
    
    filterInput.addEventListener('input', function () {
        const filterValue = filterInput.value.toLowerCase();

        const filteredReq = reqs.filter(req => req.url.toLowerCase().includes(filterValue));

        harSection.innerHTML = '';

        filteredReq.forEach(req => {
            const url = req.url;
            const entry = document.createElement('span');
            entry.className = 'urlEntry';
            entry.textContent = url;
            entry.addEventListener('click',() => {parseBeacon(url,'resultTable')})
            harSection.appendChild(entry);
        });
    });

    reqs.forEach(req => {
        const url = req.url;
        const entry = document.createElement('span');
        entry.className = 'urlEntry';
        entry.textContent = url;
        entry.addEventListener('click',() => {parseBeacon(url,'resultTable')})
        harSection.appendChild(entry);
    });
    beaconList.appendChild(harSection);
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