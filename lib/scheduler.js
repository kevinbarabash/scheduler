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
            }
        }, 0);
    };
    Scheduler.prototype.startTask = function (task) {
        var self = this;
        task.once("done", function () {
            var poppedTask = self.queue.pop_back();
            if (poppedTask !== null && !poppedTask.started()) {
                throw "popping a task that hasn't started";
            }
            self.tick();
        });
        task.start();
    };
    Scheduler.prototype.currentTask = function () {
        return this.queue.last ? this.queue.last.value : null;
    };
    Scheduler.prototype.clear = function () {
        this.queue.forEach(function (task) {
            task.removeAllListeners("done");
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
            task.once("done", function () {
                if (_repeat) {
                    setTimeout(repeatFunc, _delay);
                }
            });
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
