---
layout: post
permalink: beacon-parse
title: "Network Beacon Parser"
categories: tools
---
<style>
    div.wrapper {
        margin: 0, 0, 0, 0;
        max-width: initial;
    }
    #dropArea {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        font-size: 18px;
        margin-bottom: 10px;
    }
    #pasteBin {
        opacity: 0.01;
        width: 100%;
        height: 1px;
        overflow: hidden;
    }
    #beaconList {
        max-height: 200px;
        margin-bottom: 10px;
        overflow-y: scroll;
    }
    #filterContainer {
        padding: 10px;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        margin-bottom: 10px;
    }
    #filterInput {
        padding: 5px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
        
    }
    .urlEntry {
        display: block;
        margin-bottom: 5px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
        overflow: hidden;
        height:24px;
    }
</style>
<div class="mui-container-fluid beacon-parser-page">
    <div contenteditable="true" id="pasteBin"></div>
    <div id="dropArea">Paste Beacon code or drop .har file here.</div>
    <div id="filterContainer" class="mui-textfield">
        <input type="text" id="filterInput" placeholder="Type to filter URLs">
    </div>
    <div id="beaconList"></div>
    <div id="resultTable"></div>
</div>
<script src="/static/beaconParse.js" type="text/javascript"></script>

