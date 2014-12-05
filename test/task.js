function Task(action) {
    EventEmitter.call(this);
    this._started = false;
    this.action = action;
}

Task.prototype = Object.create(EventEmitter.prototype);
Task.prototype.constructor = Task;

Task.prototype.start = function () {
    this._started = true;
    this.action();
};

Task.prototype.complete = function () {
    this.emit("done");
};

Task.prototype.started = function () {
    return this._started;
};
