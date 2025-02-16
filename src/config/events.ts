import AppContainer from "@config/container";

const eventManager = AppContainer.resolve("EventManager");
const logger = AppContainer.getLogger("Events");

eventManager.on("test-event", (data) => {
    logger.info(`📢 Received Event: ${JSON.stringify(data)}`);
});
