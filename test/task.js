function Task(action, doneCallback) {
    this._started = false;
    this.action = action;
    this.doneCallback = doneCallback || function () {};
}

Task.prototype.start = function () {
    this._started = true;
    this.action();
};

Task.prototype.complete = function () {
    this.doneCallback();
};

Task.prototype.started = function () {
    return this._started;
};
