/**
 * User: ravioactive
 * Date: 4/11/14
 * Time: 7:05 PM
 */

function QueryResult(query) {
    this.query = query;
    this.init = false;
    this.resolution = null;
    this.location = null;
    this.region = null;
    this.breadcrumb = null;
    this.status_code = 500;
    this.data = null;

    this.prev = null;
    this.up = null;

}

QueryResult.prototype.construct = function() {
//this.setPrevious();
    this.fetchAnalytics();
    this.setOptions();
    this.setBreadcrumb();
    this.setTop();
    history.addHistory(this);
    this.setPrevious();
    this.init = true;
};

QueryResult.prototype.isOkay = function() {
    return (this.status_code == 200);
};

QueryResult.prototype.fetchAnalytics = function() {
    this.data = getAnalyticsResponse(this.query, extractData);
    this.status_code = status_code;
};

QueryResult.prototype.setOptions = function() {
    idx = this.query.index('-');
    if(idx < 0) {
        this.resolution = "countries";
        this.location = this.query;
    } else if(idx > 1){
        this.resolution = "provinces";
        var parts = this.query.split("-");
        this.region = parts[0];
        this.location = parts[1];
    }
};

QueryResult.prototype.setBreadcrumb = function() {
    this.breadcrumb = [];
    var basicLocation = this.location;
    if(this.resolution === "provinces") {
        basicLocation = this.region;
    }
    this.breadcrumb.push(getContinentFor(basicLocation));
    //this.breadcrumb.push(getSubregionFor(basicLocation));
    if(this.resolution === "provinces") {
        this.breadcrumb.push(basicLocation);
    }
    this.breadcrumb.push(this.location);
};

QueryResult.prototype.setTop = function() {
    var length = this.breadcrumb;
    this.up = new QueryResult(this.breadcrumb[length-2]);
};

QueryResult.prototype.setPrevious = function() {
    this.prev = history.getPrevious();
};

QueryResult.prototype.getOptions = function() {
    var options = {};
    options['region'] = this.region;
    options['resolution'] = this.resolution;
    return options;
};

QueryResult.prototype.getStatusMessage = function() {
    var message = "";
    if(this.isOkay()) {
        message = "OK"
    } else {
        message = "Error fetching data. Error Code: " + status_code;
    }
    return message;
};

/*QueryResult.prototype.setData = function(data) {
 this.data = data;
 };

 QueryResult.prototype.getData = function() {
 return this.data;
 };*/


var app_url = "http://www.contentsavvy.com/data/getTrends.jsp?q=";
var ajaxRequest;
var status_code;

function getAnalyticsResponse(query, callback) {
    var url = getUrlFor(this.query);
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    ajaxRequest.open("GET", url, true);
    ajaxRequest.onreadystatechange = callback;
    ajaxRequest.send(null);
}


function getUrlFor(query) {
    urlStr = app_url + query;
    return urlStr;
}

function extractData() {
    data = null;
    if (ajaxRequest.readyState == 4) {
        if (ajaxRequest.status == 200) {
            data = ajaxRequest.responseText;
        } else {
            alert("Cannot load data!");
        }

        status_code = ajaxRequest.status;
        if(data == null) {
            data = []
        }
        return data;
    }
}


function getSubregionFor(query) {
    //Look in country to subcontinent table
}

function getContinentFor(query) {
    //look in country to continent table
}
