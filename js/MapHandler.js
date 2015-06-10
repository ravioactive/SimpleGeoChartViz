/**
 * User: ravioactive
 * Date: 4/10/14
 * Time: 3:11 PM
 */


google.load('visualization', '1', {'packages': ['geochart']});
var chart = null;
function onLoad() {
    chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    google.visualization.events.addListener(chart, 'regionClick', regionClickListener);
    console.log(getUrlFor("PLACEBO"));
}

document.getElementById('inputBox').onkeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        newLocation();
    }
};

function regionClickListener(eventData) {
    console.log("Region clicked: " + eventData.region);
    var clickedRegion = eventData.region;
    var queryResult = new QueryResult(clickedRegion);
    refreshMap(queryResult);
}

function ensureFreshChart() {
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
    var current = historyStates.activeState;
    var top = current.up;
    var next = historyStates.getNext();
    var prev = historyStates.getPrevious();
    if(next != null) {
        if(top.query == next.query) {
            top = historyStates.moveFwd();
        }
    } else if(prev!=null) {
        if(top.query == prev.query) {
            top = historyStates.moveBack();
        }
    }
    refreshMap(top);
}

function gotoBack() {
    var back = historyStates.moveBack();
    if(back == null) {
        console.log("No more BACK!")
    } else {
        refreshMap(back);
    }
}

function gotoNext() {
    var next = historyStates.moveFwd();
    if(next == null) {
        console.log("No more NEXT!")
    } else {
        refreshMap(next);
    }
}

function setBreadcrumbDOM(queryResult) {
    //set DOM element - For now just the message span.
    var breadCrumb = queryResult.breadcrumb;
    var breadCrumbLength = breadCrumb.length;
    var breadCrumbStr = "";
    for(var i=0; i<breadCrumbLength; i++) {
        var uiName = null;
        if(containsCountries(breadCrumb[i])) {
            uiName = getParentNameForCode(breadCrumb[i], subContinents);
            if(uiName == null) {
                uiName = getParentNameForCode(breadCrumb[i], continents);
            }
        } else {
            uiName = breadCrumb[i];
        }
        if(uiName != null) {
            breadCrumbStr += uiName;
            if(i<breadCrumbLength-1) {
                breadCrumbStr += " &rarr; ";
            }
        }
    }

    document.getElementById("status").innerHTML = breadCrumbStr;
}

function handleErrorsOnDom(queryResult) {
    //set DOM element
    if(!queryResult.hasNoData()) {
        chart.clearChart();
    }
    document.getElementById("status").innerHTML = queryResult.getStatusMessage();
}

function refreshMap(queryResult) {
    ensureFreshChart();
    if(queryResult.init == false) {
        queryResult.construct();
    }

    if(queryResult.isOkay()) {
        setBreadcrumbDOM(queryResult);
        setUpDOM(queryResult);
        setBackDom();
        setFwdDom();

        var data = google.visualization.arrayToDataTable(queryResult.getData());
        var options = queryResult.getOptions();
        chart.clearChart();
        chart.draw(data, options);
        document.getElementById("inputBox").value = queryResult.query;
    } else if(queryResult.hasNoData()) {
        //chart.clearChart();
        setUpDOM(queryResult);
        handleErrorsOnDom(queryResult);
    } else {
        handleErrorsOnDom(queryResult);
    }
}

 function setUpDOM(queryResult) {
 //set DOM element(s) handling 'UP' functionality
     if((queryResult.init == true) && (queryResult.breadcrumb.length > 1)) {
         document.getElementById("up").disabled = false;
         document.getElementById("up").className = "upEnabled";
     } else {
         document.getElementById("up").disabled = "disabled";
         document.getElementById("up").className = "upDisabled";
     }
 }

function setBackDom() {
    //set DOM element(s) handling 'BACK' functionality
    if(historyStates.bkStates.length > 1) {
        document.getElementById("back").disabled = false;
        document.getElementById("back").className = "backEnabled";
    } else {
        document.getElementById("back").disabled = "disabled";
        document.getElementById("back").className = "backDisabled";
    }
}

function setFwdDom() {
    //set DOM element(s) handling 'FWD' functionality
    if(historyStates.fwStates.length > 0) {
        document.getElementById("fwd").disabled = false;
        document.getElementById("fwd").className = "fwdEnabled";
    } else {
        document.getElementById("fwd").disabled = "disabled";
        document.getElementById("fwd").className = "fwdDisabled";
    }
 }
