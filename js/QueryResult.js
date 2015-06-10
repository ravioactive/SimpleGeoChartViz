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
    this.up = null;

    if(this.query == "World") {
        this.query = "*";
    }

}

QueryResult.prototype.construct = function() {
    //this.fetchAnalytics();
    this.fetchDummies();
    if(this.isOkay()) {
        this.setOptions();
        this.setBreadcrumb();
        this.setTop();
        historyStates.addHistory(this);
        this.init = true;
    }
};

QueryResult.prototype.hasNoData = function() {
    return (this.status_code == "Server Response Empty")
};

QueryResult.prototype.isOkay = function() {
    return (this.status_code == "OK");
};

QueryResult.prototype.fetchDummies = function() {
    getDummyResponse(this);
};

QueryResult.prototype.fetchAnalytics = function() {
    getAnalyticsResponse(this, extractData);
};

QueryResult.prototype.setOptions = function() {
    if(this.query === "*" || this.query === "World") {
        this.resolution = "countries";
        this.location = "World";
        this.region = "World";
    } else if(containsCountries(this.query)) {
        this.resolution = "countries";
        this.region = this.query;
        this.location = this.query;
    } else if(this.query.indexOf('-') < 0) {
        this.resolution = "provinces";
        this.region = this.query;
        this.location = this.query;
    } else if(this.query.indexOf('-') > 1) {
        this.resolution = "metros";
        var parts = this.query.split("-");
        this.region = parts[0];
        this.location = parts[1];
    }

};

QueryResult.prototype.setBreadcrumb = function() {
    this.breadcrumb = [];
    this.breadcrumb.push("World");
    var cntnt = null, subCntnt = null;
    if(containsCountries(this.query)) {
        if(this.region in subContinents) {
            cntnt = getParentCodeForChild(this.region, continents);
            if(cntnt != null) {
                this.breadcrumb.push(cntnt);
                this.breadcrumb.push(this.region);
            }
        } else if(this.region in continents) {
            this.breadcrumb.push(this.region);
        }
    }
    if(this.resolution === "provinces") {
        subCntnt = getParentCodeForChild(this.location, subContinents);
        if(subCntnt != null) {
            cntnt = getParentCodeForChild(subCntnt, continents);
            if(cntnt != null) {
                this.breadcrumb.push(cntnt);
                this.breadcrumb.push(subCntnt);
            }
        }
        this.breadcrumb.push(this.location);
    } else if(this.resolution === "metros") {
        subCntnt = getParentCodeForChild(this.region, subContinents);
        if(subCntnt != null) {
            cntnt = getParentCodeForChild(subCntnt, continents);
            if(cntnt != null) {
                this.breadcrumb.push(cntnt);
                this.breadcrumb.push(subCntnt);
            }
        }
        this.breadcrumb.push(this.region);
        this.breadcrumb.push(this.location);
    }
};

QueryResult.prototype.setTop = function() {
    if(this.query == "*" || this.query == "World") {
        this.up = this;
    } else {
        var length = this.breadcrumb.length;
        this.up = new QueryResult(this.breadcrumb[length-2]);
    }
};

QueryResult.prototype.getData = function() {
    return this.data;
};

QueryResult.prototype.getOptions = function() {
    var options = {};
    options['resolution'] = this.resolution;
    if(this.resolution == "provinces" || containsCountries(this.query)) {
        options['region'] = this.region;
    } else if(this.resolution == "metros") {
        //query (CC-SS) was broken into 'region'(CC) and location(SS)
        options['region'] = this.query;
    }
    options = cosmetics(options);
    return options;
};

QueryResult.prototype.getStatusMessage = function() {
    var message = "";
    if(this.isOkay()) {
        message = "Server response successful.";
    } else {
        message = "Error fetching data. Error Code: " + this.status_code;
    }
    return message;
};

QueryResult.prototype.setData = function(data) {
 this.data = data;
};


function containsCountries(n) {
    return  (n.length == 3) && !isNaN(parseFloat(n)) && isFinite(n);
}

var app_url = "/data/getTrends.jsp?q=";
var ajaxRequest;

function cosmetics(options) {
    options['backgroundColor'] = '#ADD6FF';
    options['datalessRegionColor'] = "#85AD35";
    options['colorAxis'] = {"colors": ['#CDCDCD', '#800000']};
    return options;
}


function getUrlFor(query) {
    if(query == "World") {
        query = "*";
    }
    return app_url + query;
}

function getAnalyticsResponse(queryResult, callback) {
    var url = getUrlFor(queryResult.query);
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    ajaxRequest.open("GET", url, true);
    ajaxRequest.onreadystatechange = (function(q) {
        callback(q);
    })(queryResult);
    ajaxRequest.send(null);
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
    } else {
        data = [];
        status = "Request was not ready."
    }
    queryResult.setData(data);
    queryResult.status_code = status;
}

function getDummyResponse(queryResult) {
    var data = null;
    var status = null;
    var query = queryResult.query;
    if(query == "World") {
        query = "*";
    }
    data = dummy[query];
    if(data == null || (data.length == 0)) {
        data = [];
        status = "Server Response Empty";
    } else {
        status = "OK";
    }
    queryResult.setData(data);
    queryResult.status_code = status;
}
