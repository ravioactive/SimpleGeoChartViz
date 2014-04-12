/**
 * User: ravioactive
 * Date: 4/10/14
 * Time: 3:11 PM
 */

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

var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));



function newLocation(query) {
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
    //set DOM element

}

function setUpDOM(queryResult) {
    //set DOM element

}

function setBackDom(queryResult) {
    //set DOM element

}

function setFwdDom() {
    //set DOM element

}

function handleErrorsOnDom(message) {
    //set DOM element

}

function refreshMap(queryResult) {
    if(queryResult.init == false) {
        queryResult.construct();
    }

    if(queryResult.isOkay()) {
        setBreadcrumbDOM(queryResult.breadcrumb);
        setUpDOM(queryResult.up);
        setBackDom(queryResult.prev);
        setFwdDom();

        var options = queryResult.getOptions();
        chart.draw(mapdata, options);
    } else {
        handleErrorsOnDom(queryResult.getStatusMessage());
    }
}
