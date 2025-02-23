import AppContainer from "@config/container";
import type { UserMailJobData } from "@jobs/UserMailJob";
import type { Job } from "bullmq";

const bullMQ = AppContainer.resolve("BullMQ");

const jobClass = AppContainer.resolve("UserMailJob");
bullMQ.createWorker("mailQueue", async (job: Job<UserMailJobData>) => jobClass.worker(job));
