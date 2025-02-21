import AppContainer from "@config/container";
import type { HelloJobData } from "@jobs/HelloJob";
import type { Job } from "bullmq";

const bullMQ = AppContainer.resolve("BullMQ");

const jobClass = AppContainer.resolve("HelloJob");
bullMQ.createWorker("helloQueue", async (job: Job<HelloJobData>) => jobClass.worker(job));
