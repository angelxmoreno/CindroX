import { appConfig } from "@config/app";
import AppContainer from "@config/container";
import { QueueEvents } from "bullmq";

const eventManager = AppContainer.resolve("EventManager");
const logger = AppContainer.getLogger("Queue");
const queueLogsModel = AppContainer.resolve("QueueLogsModel");

const queueNames = appConfig.bullMq.queues;

// Function to log queue events to the database
const logEvent = async (queueName: string, event: string, jobId: string, details?: object) => {
    try {
        await queueLogsModel.create({
            queue: queueName,
            jobId,
            event,
            details: details ? JSON.stringify(details) : null,
        });
    } catch (e) {
        const error = e as Error;
        logger.error(`Failed to log event "${event}" for job ${jobId}: ${error.message}`);
    }
};

// Attach QueueEvents to each queue
for (const queueName of queueNames) {
    const queueEvents = new QueueEvents(queueName, {
        connection: { host: "redis", port: 6379 },
    });

    queueEvents.on("waiting", async ({ jobId }) => {
        await eventManager.emit("queue:waiting", { queue: queueName, jobId });
        await logEvent(queueName, "waiting", jobId);
        logger.info({ queue: queueName, jobId }, "Job waiting");
    });

    queueEvents.on("active", async ({ jobId }) => {
        await eventManager.emit("queue:active", { queue: queueName, jobId });
        await logEvent(queueName, "active", jobId);
        logger.info({ queue: queueName, jobId }, "Job started");
    });

    queueEvents.on("completed", async ({ jobId, returnvalue }) => {
        await eventManager.emit("queue:completed", { queue: queueName, jobId, returnvalue });
        await logEvent(queueName, "completed", jobId, { returnvalue });
        logger.info({ queue: queueName, jobId, returnvalue }, "Job completed");
    });

    queueEvents.on("failed", async ({ jobId, failedReason }) => {
        await eventManager.emit("queue:failed", { queue: queueName, jobId, failedReason });
        await logEvent(queueName, "failed", jobId, { failedReason });
        logger.error({ queue: queueName, jobId, failedReason }, "Job failed");
    });

    queueEvents.on("stalled", async ({ jobId }) => {
        await eventManager.emit("queue:stalled", { queue: queueName, jobId });
        await logEvent(queueName, "stalled", jobId);
        logger.warn({ queue: queueName, jobId }, "Job stalled");
    });

    logger.info(`QueueEvents listening for queue: ${queueName}`);
}
