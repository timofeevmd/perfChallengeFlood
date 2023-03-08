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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.982484076433121, 500, 1000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9821428571428571, 500, 1000, "STEP2 /step/2"], "isController": false}, {"data": [0.8275862068965517, 500, 1000, "OpenStartPage /"], "isController": false}, {"data": [1.0, 500, 1000, "STEP4 /step/4"], "isController": false}, {"data": [1.0, 500, 1000, "STEPDONE /done"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5 /step/5"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5 /code"], "isController": false}, {"data": [1.0, 500, 1000, "STEPDONE /start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP2 /start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP3 /start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP3 /step/3"], "isController": false}, {"data": [1.0, 500, 1000, "STEP4 /start"], "isController": false}, {"data": [1.0, 500, 1000, "STEP5 /start"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 314, 0, 0.0, 289.407643312102, 232, 1901, 254.0, 343.0, 409.0, 1184.050000000001, 5.2633343390660094, 9.305237117193, 8.178404012244796], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["STEP2 /step/2", 28, 0, 0.0, 289.25, 237, 568, 255.5, 426.00000000000006, 524.3499999999997, 568.0, 0.5105576018380074, 1.2067158553207395, 0.72309999635316], "isController": false}, {"data": ["OpenStartPage /", 29, 0, 0.0, 448.7931034482759, 238, 1901, 253.0, 1192.0, 1572.5, 1901.0, 0.4886597243285142, 1.537839929186466, 0.332135906379537], "isController": false}, {"data": ["STEP4 /step/4", 25, 0, 0.0, 265.56000000000006, 237, 351, 255.0, 303.0, 337.49999999999994, 351.0, 0.5162622612287042, 1.033956343572535, 0.7486811112545173], "isController": false}, {"data": ["STEPDONE /done", 24, 0, 0.0, 268.125, 233, 433, 246.5, 363.0, 426.25, 433.0, 0.5206186685177553, 0.996496670209766, 0.7539819193474914], "isController": false}, {"data": ["STEP5 /step/5", 25, 0, 0.0, 270.28000000000003, 236, 391, 257.0, 344.8, 379.29999999999995, 391.0, 0.5163902257658067, 1.0874250265940968, 0.7488666848263896], "isController": false}, {"data": ["STEP5 /code", 25, 0, 0.0, 254.51999999999998, 232, 344, 243.0, 321.4000000000001, 343.7, 344.0, 0.5171272546748304, 0.5449026443302167, 0.6575192242056925], "isController": false}, {"data": ["STEPDONE /start", 25, 0, 0.0, 258.35999999999996, 233, 365, 247.0, 300.40000000000003, 346.69999999999993, 365.0, 0.5174055217517282, 0.571470356544145, 0.9603531551388717], "isController": false}, {"data": ["STEP2 /start", 29, 0, 0.0, 273.10344827586204, 233, 448, 248.0, 339.0, 419.5, 448.0, 0.5101771546188625, 0.5634866815175131, 0.9087186966732931], "isController": false}, {"data": ["STEP3 /start", 28, 0, 0.0, 276.14285714285717, 233, 454, 258.5, 347.80000000000007, 425.6499999999998, 454.0, 0.5106041541295111, 0.5639582991410909, 0.9239741187519375], "isController": false}, {"data": ["STEP3 /step/3", 26, 0, 0.0, 291.61538461538464, 246, 437, 279.0, 368.1000000000001, 431.75, 437.0, 0.4889515749882463, 1.4461756582040433, 0.6957055124588623], "isController": false}, {"data": ["STEP4 /start", 25, 0, 0.0, 268.8799999999999, 234, 378, 248.0, 356.40000000000003, 373.5, 378.0, 0.5159639238024478, 0.5698781228716487, 1.026203872825212], "isController": false}, {"data": ["STEP5 /start", 25, 0, 0.0, 286.03999999999996, 235, 467, 268.0, 366.20000000000016, 448.09999999999997, 467.0, 0.516219620475335, 0.5701605378492226, 1.1159417975283403], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 314, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
