/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9890965732087228, 500, 1000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1000, "GET_STEP4_/step/4"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP3_/step/3"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP2_/step/2"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP5_/step/5"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP2_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP3_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP4_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEPDONE_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP5_/start"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEPDONE_/done"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP5_/code"], "isController": false}, {"data": [0.8793103448275862, 500, 1000, "GET_openStartPage_/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 321, 0, 0.0, 258.9408099688475, 228, 1528, 237.0, 273.0, 310.39999999999986, 972.9199999999996, 5.452136694068891, 9.638802578724778, 8.65165772131259], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET_STEP4_/step/4", 26, 0, 0.0, 248.49999999999997, 234, 315, 240.0, 301.2, 311.15, 315.0, 0.5096540233264726, 1.018159487405665, 0.7642130378320102], "isController": false}, {"data": ["GET_STEP3_/step/3", 27, 0, 0.0, 256.8148148148147, 238, 335, 252.0, 279.0, 314.1999999999999, 335.0, 0.5124701059104886, 1.5125912540807804, 0.7284274700584595], "isController": false}, {"data": ["GET_STEP2_/step/2", 29, 0, 0.0, 245.51724137931035, 235, 272, 244.0, 258.0, 265.5, 272.0, 0.5243269630620694, 1.2388672334068598, 0.7419078212858667], "isController": false}, {"data": ["GET_STEP5_/step/5", 26, 0, 0.0, 243.5769230769231, 233, 299, 239.0, 262.6, 294.09999999999997, 299.0, 0.5095641266854813, 1.0727565091917528, 0.764078240141894], "isController": false}, {"data": ["POST_STEP2_/start", 29, 0, 0.0, 245.75862068965515, 228, 372, 234.0, 268.0, 356.0, 372.0, 0.5235224031483554, 0.578226404258584, 0.9317133286095968], "isController": false}, {"data": ["POST_STEP3_/start", 28, 0, 0.0, 240.78571428571428, 230, 322, 234.0, 266.00000000000006, 317.04999999999995, 322.0, 0.5209205410131904, 0.5753526678573422, 0.9421699712563487], "isController": false}, {"data": ["POST_STEP4_/start", 27, 0, 0.0, 251.4814814814815, 230, 434, 235.0, 304.2, 390.39999999999975, 434.0, 0.5134641716111364, 0.5671171661056594, 1.0464655360946296], "isController": false}, {"data": ["POST_STEPDONE_/start", 25, 0, 0.0, 239.32000000000005, 229, 275, 234.0, 263.0, 272.3, 275.0, 0.5216592938819797, 0.5761686146294133, 1.0003020733348635], "isController": false}, {"data": ["POST_STEP5_/start", 26, 0, 0.0, 241.88461538461542, 230, 300, 234.5, 292.9, 298.25, 300.0, 0.5096939875713081, 0.5629530272882319, 1.1268632623355745], "isController": false}, {"data": ["GET_STEPDONE_/done", 24, 0, 0.0, 247.62500000000003, 231, 350, 236.0, 286.0, 338.75, 350.0, 0.5357740819287867, 1.0255050786918183, 0.8090676972876437], "isController": false}, {"data": ["GET_STEP5_/code", 25, 0, 0.0, 247.96, 230, 334, 237.0, 294.2000000000001, 329.8, 334.0, 0.5202805352646147, 0.5482252905766789, 0.6937412527835009], "isController": false}, {"data": ["GET_openStartPage_/", 29, 0, 0.0, 386.17241379310343, 232, 1528, 237.0, 976.0, 1291.5, 1528.0, 0.5065944623984627, 1.5934456611931174, 0.34432592366145515], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 321, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
