/**
 * The purpose of the scheduler is to:
 * - add tasks to a queue in a certain order
 * - remove tasks from the queue when they have completed
 * - reschedule recurring tasks
 */

import basic = require("../node_modules/basic-ds/lib/basic");

interface Task {
    started: () => boolean;
    removeAllListeners: (event: string) => void;
    once: (event: string, callback: (...rest) => void) => void;
    doneCallbacks: any[];
}

class Scheduler {
    private queue: basic.LinkedList<Task>;

    constructor () {
        this.queue = new basic.LinkedList<Task>();
    }

    addTask(task) {
        this.queue.push_front(task);
        this.tick();
    }

    tick() {
        var self = this;
        setTimeout(function () {
            var currentTask = self.currentTask();
            if (currentTask !== null && !currentTask.started()) {
                self.startTask(currentTask);
                self.tick();
            }
        }, 0);  // defer execution
    }

    startTask(task) {
        var self = this;
        //task.once("done", function () {
        //    var poppedTask = self.queue.pop_back();
        //    if (poppedTask !== null && !poppedTask.started()) {
        //        throw "popping a task that hasn't started";
        //    }
        //    self.tick();
        //});
        task.start();
    }

    removeTask(task) {
        if (task === this.currentTask()) {
            this.queue.pop_back();
            this.tick();
        } else {
            throw "not the current task";
        }
    }

    private currentTask() {
        return this.queue.last ? this.queue.last.value : null;
    }

    clear() {
        this.queue.forEach(function (task) {
            //task.removeAllListeners("done");
            task.doneCallbacks = [];
        });
        this.queue.clear();
    }

    createRepeater(createFunc, delay: number) {
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
            //task.once("done", function () {
            //    if (_repeat) {
            //        setTimeout(repeatFunc, _delay);
            //    }
            //});
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
    }
}

export = Scheduler;
