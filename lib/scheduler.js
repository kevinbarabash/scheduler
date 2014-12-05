var basic = require("../node_modules/basic-ds/lib/basic");
var Scheduler = (function () {
    function Scheduler() {
        this.queue = new basic.LinkedList();
    }
    Scheduler.prototype.addTask = function (task) {
        this.queue.push_front(task);
        this.tick();
    };
    Scheduler.prototype.tick = function () {
        var self = this;
        setTimeout(function () {
            var currentTask = self.currentTask();
            if (currentTask !== null && !currentTask.started()) {
                self.startTask(currentTask);
                self.tick();
            }
        }, 0);
    };
    Scheduler.prototype.startTask = function (task) {
        var self = this;
        task.start();
    };
    Scheduler.prototype.removeTask = function (task) {
        if (task === this.currentTask()) {
            this.queue.pop_back();
            this.tick();
        }
        else {
            throw "not the current task";
        }
    };
    Scheduler.prototype.currentTask = function () {
        return this.queue.last ? this.queue.last.value : null;
    };
    Scheduler.prototype.clear = function () {
        this.queue.forEach(function (task) {
            task.doneCallbacks = [];
        });
        this.queue.clear();
    };
    Scheduler.prototype.createRepeater = function (createFunc, delay) {
        var _repeat = true;
        var _scheduler = this;
        var _delay = delay;
        function repeatFunc() {
            if (!_repeat) {
                return;
            }
            var task = createFunc();
            task.doneCallback = function () {
                if (_repeat) {
                    setTimeout(repeatFunc, _delay);
                }
                _scheduler.removeTask(task);
            };
            _scheduler.addTask(task);
        }
        var repeater = {
            stop: function () {
                _repeat = false;
            },
            start: function () {
                repeatFunc();
            }
        };
        Object.defineProperty(repeater, "delay", {
            get: function () {
                return _delay;
            },
            set: function (delay) {
                _delay = delay;
            }
        });
        return repeater;
    };
    return Scheduler;
})();
module.exports = Scheduler;
