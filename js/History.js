/**
 * User: ravioactive
 * Date: 4/11/14
 * Time: 7:05 PM
 */
function HistoryStates() {
    this.activeState = null;
    this.bkStates = [];
    this.fwStates = [];
}

HistoryStates.prototype.getTop = function(states) {
    return states[states.length-1];
};

HistoryStates.prototype.addHistory = function(queryResult) {
    if(queryResult == null || queryResult == undefined) {
        console.log("History state was NULL!");
        return;
    }
    if(this.activeState != null) {
        if(queryResult.query == this.activeState.query) {
            console.log("New is same as current");
            return;
        }
        if(this.fwStates != null && this.fwStates.length > 0) {
            if(queryResult.query == this.getNext().query) {
                console.log("New is same as next");
                this.moveFwd();
                return;
            }
        }
    }
    this.bkStates.push(queryResult);
    this.activeState = queryResult;
};

HistoryStates.prototype.moveBack = function() {
    if(this.bkStates.length > 1) {
        var state = this.bkStates.pop();
        this.fwStates.push(state);
        this.activeState = this.getTop(this.bkStates);
        return this.activeState;
    }
};

HistoryStates.prototype.moveFwd = function() {
    if(this.fwStates.length > 0) {
        var state = this.fwStates.pop();
        this.bkStates.push(state);
        this.activeState = state;
        return this.activeState;
    }
};

HistoryStates.prototype.getCurrent = function() {
    return this.activeState;
};

HistoryStates.prototype.getPrevious = function() {
    return this.bkStates[this.bkStates.length-2];
};

HistoryStates.prototype.getNext = function() {
    return this.fwStates[this.fwStates.length-1];
};

var historyStates = new HistoryStates();
