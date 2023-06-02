---
layout: post
permalink: beacon-parse
title: "Adobe Beacone Parser"
categories: tools
---
<link href="https://cdn.muicss.com/mui-0.10.3/css/mui.min.css" rel="stylesheet" type="text/css" />
<div class="mui-container-fluid">
    <div class="mui--text-display1">Beacon Parse</div>
    <div class="mui-textfield">
        <textarea name="beacon" id="beacon" class="textArea" placeholder="Paste Beacon Code Here"></textarea>
    </div>
    <button id="button" class="mui-btn mui-btn--primary">Parse Beacon</button>
    <div id="result"></div>
</div>
<script type="text/javascript">
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

        // create table headers for object index and event names
        const header = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell1 = document.createElement('th');
        headerCell1.textContent = 'Keys'
        headerRow.appendChild(headerCell1); // empty header cell keys column
        json.forEach((key, index) => {
            const headerCell = document.createElement('th');
            headerCell.textContent = (index + 1).toString();
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
        table.classList.add('mui-table', 'mui-table--bordered','mui--text-body2');

        return table;
    }


    var beacons = []
    document.getElementById('button').addEventListener('click', () => {
        const text = document.getElementById('beacon').value;
        const result = document.getElementById('result');
        const result2 = document.getElementById('result2');
        beacons.push(adobeAAM_parseParams(text))
        //convert(params, 'result')
        //result.innerHTML = jsonToTable(params).toString();
        result.innerHTML = jsonToTable(beacons).outerHTML;

        //result2.innerHTML = JSON.stringify(beacons, null, 2);//.join('<br/>');


    });
</script>

