declare class Scheduler {
    private queue;
    constructor();
    addTask(task: any): void;
    private tick();
    private removeTask(task);
    private currentTask();
    clear(): void;
    createRepeater(createFunc: any, delay: number): {
        stop: () => void;
        start: () => void;
    };
}
export = Scheduler;
