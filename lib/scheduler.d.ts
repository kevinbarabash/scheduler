declare class Scheduler {
    private queue;
    constructor();
    addTask(task: any): void;
    tick(): void;
    startTask(task: any): void;
    private currentTask();
    clear(): void;
    createRepeater(createFunc: any, delay: number): {
        stop: () => void;
        start: () => void;
    };
}
export = Scheduler;
