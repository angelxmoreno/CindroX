import AppContainer from "@config/container";
import { defineConfig } from "drizzle-kit";

const config = AppContainer.resolve("drizzleKitConfig");
export default defineConfig(config);
