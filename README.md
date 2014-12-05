[![Build Status](https://travis-ci.org/kevinb7/scheduler.svg)](https://travis-ci.org/kevinb7/scheduler)

# scheduler #

Schedule and run "re-entrant" tasks in JavaScript.

## Summary ##

This project was initial started as part of a debugger.  I needed a simple
scheduler that would run tasks in order.  The catch was that some of those tasks
were "re-entrant".

While JavaScript isn't strictly "re-entrant" there may be a method that needs to
be called several times before it's actually finished the job.  In the case of
the debugger, it needs to step through a function from the front to end.  It may
run into a breakpoint in which case it should give control back to the main
thread so the user can take appropriate action.

Initially I tried using Promises but it was difficult because Promises didn't
model the problem very well.  The debugger need to be notified when a breakpoint
was hit or when the function completed.  In the end, using an EventEmitter to
communicate this information was a more natural fit.

That being said, I still needed a way to schedule tasks.  Each time the "draw"
function was triggered that was a new task that could potentially hit a breakpoint.
Same with any event handler.

The Scheduler is pretty simple.  You can add task it to.  It listens for each
task to emit a "done" event.  When that occurs it will start the next task.  All
of this is done asynchronously so as long as each task doesn't take too long the
UI will remain responsive.

It does not pre-emptively stop a long running task nor does it break a task into
smaller chunks nor does it repeatedly call a specific method until the task is
done.  These are things that might be useful for other problems and I could see
myself adding this functionality in the future.

## API ##

- *addTask(task)* adds the task the queue (currently first-in-first-out)
- *tick* private - gets the current task and starts it if it hasn't been started
  already.  (async)
- *startTask(task)* starts a task, this should be private but right now it's
  getting called by the debugger to start the first task synchronously so that
  it was easier to write the tests.
- *currentTask()* returns the next pending task whether it's been started or not
- *clear()* removes all tasks from the queue.  Need to think about what to do
  with the current task if it's already been started (TODO)
- *createRepeater(createFunc, delay)* createFunc is a function that returns a
  new task when called, delay is the time between calls to createFunc.  Returns
  an object with two methods: start(), stop() and one access "delay" which can
  be used to change the delay while it's running.

## TODO ##

- clean up the API
- provide callback mechanism for when tasks complete, right now you have to add
  a .once("done", callback) to the task before adding it
- add a method like *startNextTaskNow()* which grabs the next task and runs in
  synchronously if it hasn't been started yet

