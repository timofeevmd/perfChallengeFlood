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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9822064056939501, 500, 1000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1000, "STEP3_/start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5_/step/5"], "isController": false}, {"data": [1.0, 500, 1000, "STEP3_/step/3"], "isController": false}, {"data": [1.0, 500, 1000, "STEPDONE_/start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP2_/start"], "isController": false}, {"data": [0.8, 500, 1000, "openStartPage_/"], "isController": false}, {"data": [1.0, 500, 1000, "STEP4_/start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5_/start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP2_/step/2"], "isController": false}, {"data": [1.0, 500, 1000, "STEPDONE_/done"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5_/code"], "isController": false}, {"data": [1.0, 500, 1000, "STEP4_/step/4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 281, 0, 0.0, 272.7651245551604, 230, 2122, 244.0, 287.8, 331.69999999999993, 1289.3600000000001, 4.835906173094464, 8.53480029299396, 7.691377141523397], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["STEP3_/start", 25, 0, 0.0, 248.51999999999998, 234, 294, 241.0, 283.0, 290.7, 294.0, 0.47934961843770374, 0.5294379086455497, 0.8675291863998925], "isController": false}, {"data": ["STEP5_/step/5", 23, 0, 0.0, 246.04347826086956, 235, 350, 241.0, 254.8, 331.59999999999974, 350.0, 0.47472600053664676, 0.9994401329232802, 0.7121494703193049], "isController": false}, {"data": ["STEP3_/step/3", 24, 0, 0.0, 263.25, 240, 332, 255.0, 309.5, 332.0, 332.0, 0.47685277170673557, 1.4093506295946752, 0.6781026475263263], "isController": false}, {"data": ["STEPDONE_/start", 22, 0, 0.0, 258.6363636363636, 230, 433, 239.0, 373.4, 425.4999999999999, 433.0, 0.47263040302483456, 0.5220165877159061, 0.9070777745552977], "isController": false}, {"data": ["STEP2_/start", 25, 0, 0.0, 250.07999999999998, 231, 329, 242.0, 284.80000000000007, 319.7, 329.0, 0.4780388932443544, 0.5279902229095359, 0.8516188189571104], "isController": false}, {"data": ["openStartPage_/", 25, 0, 0.0, 481.5199999999999, 234, 2122, 254.0, 1289.8, 1872.6999999999994, 2122.0, 0.4539182220931077, 1.4280515503576876, 0.3085225415789091], "isController": false}, {"data": ["STEP4_/start", 24, 0, 0.0, 244.625, 230, 272, 238.5, 262.0, 270.0, 272.0, 0.47847843856536215, 0.5284756972826412, 0.9757642571622241], "isController": false}, {"data": ["STEP5_/start", 23, 0, 0.0, 243.47826086956522, 231, 311, 236.0, 280.6, 307.79999999999995, 311.0, 0.474765197646816, 0.5243744516978016, 1.0502204497368148], "isController": false}, {"data": ["STEP2_/step/2", 25, 0, 0.0, 258.68000000000006, 235, 336, 252.0, 290.6, 324.9, 336.0, 0.47873460868233086, 1.1307674055935353, 0.6779891889756995], "isController": false}, {"data": ["STEPDONE_/done", 20, 0, 0.0, 255.35, 234, 383, 241.0, 284.6, 378.0999999999999, 383.0, 0.4978096375945838, 0.952838759458383, 0.7520620208582238], "isController": false}, {"data": ["STEP5_/code", 22, 0, 0.0, 247.86363636363637, 231, 298, 243.0, 283.7, 295.9, 298.0, 0.4720017163698777, 0.49735337105771293, 0.6296848181720661], "isController": false}, {"data": ["STEP4_/step/4", 23, 0, 0.0, 259.9565217391305, 233, 379, 248.0, 297.6, 363.19999999999976, 379.0, 0.4744322283875493, 0.9484212880835001, 0.7117087746756328], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 281, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
