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
    this.status_code = "Uninitialized";
    this.data = null;

    this.prev = null;
    this.up = null;

}

QueryResult.prototype.construct = function() {
//this.setPrevious();
    this.fetchAnalytics();
    if(this.isOkay()) {
        this.setOptions();
        this.setBreadcrumb();
        this.setTop();
        this.setPrevious();
        history.addHistory(this);
        this.init = true;
    }
};

QueryResult.prototype.isOkay = function() {
    return (this.status_code == "OK");
};

QueryResult.prototype.fetchAnalytics = function() {
    this.data = getAnalyticsResponse(this, extractData);
    this.status_code = status_code;
};

QueryResult.prototype.setOptions = function() {
    if(this.query === "*" || this.query === "World") {
        this.resolution = "countries";
        this.location = "World";
        this.region = "World";
    } else if(isContinent(this.query)) {
        this.resolution = "countries";
        this.region = this.query;
    } else if(this.query.index('-') < 0) {
        this.resolution = "provinces";
        this.location = this.query;
    } else if(this.query.index('-') > 1) {
        this.resolution = "metros";
        var parts = this.query.split("-");
        this.region = parts[0];
        this.location = parts[1];
    }

};

QueryResult.prototype.setBreadcrumb = function() {
    this.breadcrumb = [];
    this.breadcrumb.push("World");
    if(this.resolution === "provinces") {
        this.breadcrumb.push(this.location);
    } else if(this.resolution === "metros") {
        this.breadcrumb.push(this.region);
        this.breadcrumb.push(this.location);
    }
};

QueryResult.prototype.setTop = function() {
    var length = this.breadcrumb;
    this.up = new QueryResult(this.breadcrumb[length-2]);
};

QueryResult.prototype.setPrevious = function() {
    this.prev = history.activeState;
};

QueryResult.prototype.getData = function() {
    return this.data;
};

QueryResult.prototype.getOptions = function() {
    var options = {};
    options['resolution'] = this.resolution;
    if(this.resolution == "provinces" || isContinent(this.query)) {
        options['region'] = this.region;
    } else if(this.resolution == "metros") {
        //query (CC-SS) was broken into 'region'(CC) and location(SS)
        options['region'] = this.query;
    }
    return options;
};

QueryResult.prototype.getStatusMessage = function() {
    var message = "";
    if(this.isOkay()) {
        message = "Server response successful.";
    } else {
        message = "Error fetching data. Error Code: " + status_code;
    }
    return message;
};

QueryResult.prototype.setData = function(data) {
 this.data = data;
};


var app_url = "http://www.contentsavvy.com/data/getTrends.jsp?q=";
var ajaxRequest;
var status_code;

function isContinent(n) {
    return  (n.length == 3) && !isNaN(parseFloat(n)) && isFinite(n);
}

function getAnalyticsResponse(queryResult, callback) {
    var url = getUrlFor(queryResult.query);
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    ajaxRequest.open("GET", url, true);
    ajaxRequest.onreadystatechange = function(queryResult) {
        callback(queryResult);
    };
    ajaxRequest.send(null);
}


function getUrlFor(query) {
    if(query == "World") {
        query = "*";
    }
    return app_url + query;
}

function extractData(queryResult) {
    var data = null;
    var status = null;
    if (ajaxRequest.readyState == 4) {
        if (ajaxRequest.status == 200) {
            data = ajaxRequest.responseText;
            status = "OK"
        } else {
            //alert("Cannot load data!");
            status = "Server Request Failed. Code: " + ajaxRequest.status;
        }

        if(data == null) {
            data = [];
            status = "Server Response Empty."
        }
        queryResult.setData(data);
        queryResult.status_code = status;
    }
}

function getSubregionFor(query) {
    //Look in country to subcontinent table
}

function getContinentFor(query) {
    //look in country to continent table
}
