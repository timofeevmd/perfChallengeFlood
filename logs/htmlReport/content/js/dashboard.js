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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9389830508474576, 500, 1000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1000, "GET_STEP4_/step/4"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP3_/step/3"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP2_/step/2"], "isController": false}, {"data": [0.4375, 500, 1000, "GET_STEP5_/step/5"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP2_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP3_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP4_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEPDONE_/start"], "isController": false}, {"data": [1.0, 500, 1000, "POST_STEP5_/start"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEPDONE_/done"], "isController": false}, {"data": [1.0, 500, 1000, "GET_STEP5_/code"], "isController": false}, {"data": [0.8333333333333334, 500, 1000, "GET_/"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 295, 0, 0.0, 317.28813559322055, 230, 1698, 251.0, 555.8000000000088, 757.5999999999999, 1200.7200000000043, 4.952489675318135, 8.76815934740456, 7.844961366383507], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET_STEP4_/step/4", 25, 0, 0.0, 253.16, 232, 311, 251.0, 274.4, 300.2, 311.0, 0.49188391539596654, 0.9831721901131333, 0.7379219441711755], "isController": false}, {"data": ["GET_STEP3_/step/3", 25, 0, 0.0, 255.72000000000003, 240, 290, 252.0, 283.20000000000005, 289.4, 290.0, 0.48888280501398207, 1.445450762168293, 0.69522572330211], "isController": false}, {"data": ["GET_STEP2_/step/2", 25, 0, 0.0, 260.71999999999997, 234, 453, 255.0, 272.6, 399.5999999999999, 453.0, 0.4865422415974155, 1.149456045773894, 0.6890464441060272], "isController": false}, {"data": ["GET_STEP5_/step/5", 24, 0, 0.0, 821.2083333333331, 710, 1410, 738.5, 1093.5, 1344.0, 1410.0, 0.4837539305006853, 1.0183516273784567, 0.7257096317423204], "isController": false}, {"data": ["POST_STEP2_/start", 25, 0, 0.0, 247.48, 230, 299, 242.0, 274.20000000000005, 293.9, 299.0, 0.48612596496004046, 0.5369223304392634, 0.8657979393120345], "isController": false}, {"data": ["POST_STEP3_/start", 25, 0, 0.0, 246.32000000000002, 230, 280, 243.0, 265.2, 276.09999999999997, 280.0, 0.48853887792390516, 0.5395873739569694, 0.8834538599456745], "isController": false}, {"data": ["POST_STEP4_/start", 25, 0, 0.0, 250.88000000000002, 230, 341, 242.0, 291.4000000000001, 336.2, 341.0, 0.4908312718419916, 0.5421193051301685, 1.0002412742470648], "isController": false}, {"data": ["POST_STEPDONE_/start", 23, 0, 0.0, 247.56521739130432, 231, 267, 250.0, 262.8, 266.8, 267.0, 0.49123256658337067, 0.5406436548236903, 0.9420018528010936], "isController": false}, {"data": ["POST_STEP5_/start", 24, 0, 0.0, 262.625, 235, 366, 252.5, 307.0, 356.25, 366.0, 0.48884815154292705, 0.5375420103880232, 1.0779085828495774], "isController": false}, {"data": ["GET_STEPDONE_/done", 23, 0, 0.0, 256.4347826086956, 234, 320, 252.0, 291.80000000000007, 317.79999999999995, 320.0, 0.49130601956679626, 0.940390428077071, 0.7422993121715726], "isController": false}, {"data": ["GET_STEP5_/code", 24, 0, 0.0, 271.875, 234, 428, 250.0, 319.0, 400.75, 428.0, 0.4887286944834749, 0.5149787708473333, 0.6520359877410552], "isController": false}, {"data": ["GET_/", 27, 0, 0.0, 430.1481481481482, 234, 1698, 253.0, 1186.4, 1495.599999999999, 1698.0, 0.45781334780249594, 1.4405853387394874, 0.31117000983450893], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 295, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
