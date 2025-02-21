const common = {
    interpreter: "bun", // Bun interpreter
    env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
    },
    time: true,
};
const pmConfig = {
    apps: [
        {
            name: "HelloWorker",
            script: "src/workers/HelloWorker.ts",
            instances: 2, // Spawns 2 separate processes
            // exec_mode: "cluster", // does not work with custom interpreter
            out_file: "logs/workers/helloWorker.log",
            error_file: "logs/workers/helloWorker-errors.log",
            ...common,
        },
        {
            name: "QueueEventListener",
            script: "src/workers/QueueEventListener.ts",
            out_file: "logs/workers/QueueEventListener.log",
            error_file: "logs/workers/QueueEventListener-errors.log",
            ...common,
        },
    ],
};

module.exports = pmConfig;
