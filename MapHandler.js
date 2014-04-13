/**
 * TODO:
 * 1. Prepare DOM. Wire with JS.
 * 2. Get the ISO data, start with dummy data
 * 3. New -> unknownLocation -> refresh -> allDOM
 * 4. Back -> moveBack -> refresh -> allDOM
 * 5. Fwd -> moveForward -> refresh -> allDOM
 * 6. Up -> moveUp -> refresh -. allDOM
 *
 * 7. CSS. Initial state. Change state of DOM with allDOM JS
 * 8. Check 3,4,5,6 with CSS
 *
 * TESTING:
 * 1. Addition of new query
 * 2. Previous query
 * 3. Next query
 * 4. Back and forth, Back and forth, Back and forth...
 */
/**
 * User: ravioactive
 * Date: 4/10/14
 * Time: 3:11 PM
 */


google.load('visualization', '1', {'packages': ['geochart']});
var chart = null;
function onLoad() {
    chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
}

function ensureChart() {
    if(chart==null) {
        chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    }
}
function newLocation() {
    var query = document.getElementById("inputBox").value;
    var queryResult = new QueryResult(query);
    refreshMap(queryResult);
}

function gotoTop() {
    var current = history.activeState;
    var top = current.top;
    refreshMap(top);
}

function gotoBack() {
    var back = history.moveBack();
    refreshMap(back);
}

function gotoNext() {
    var next = history.moveFwd();
    refreshMap(next);
}

function setBreadcrumbDOM(queryResult) {
    //set DOM element - For now just the message span.
    var breadCrumb = queryResult.breadcrumb;
    var breadCrumbLength = breadCrumb.length;
    var breadCrumbStr = "";
    for(var i=0; i<breadCrumbLength; i++) {
        if(i!=0) {
            breadCrumbStr += " -> ";
        }
        breadCrumbStr += breadCrumb[i];
    }

    document.getElementById("status").innerHTML = breadCrumbStr;
}

function handleErrorsOnDom(message) {
    //set DOM element
    document.getElementById("status").innerHTML = message;
}

function refreshMap(queryResult) {
    ensureChart();
    if(queryResult.init == false) {
        queryResult.construct();
    }

    if(queryResult.isOkay()) {
        setBreadcrumbDOM(queryResult);
        //setUpDOM(queryResult.up);
        //setBackDom(queryResult.prev);
        //setFwdDom();

        var data = google.visualization.arrayToDataTable(queryResult.getData());
        var options = queryResult.getOptions();
        chart.draw(data, options);
    } else {
        handleErrorsOnDom(queryResult.getStatusMessage());
    }
}

/*
 function setUpDOM(queryResult) {
 //set DOM element

 }

 function setBackDom(queryResult) {
 //set DOM element

 }

 function setFwdDom() {
 //set DOM element

 }
 */
