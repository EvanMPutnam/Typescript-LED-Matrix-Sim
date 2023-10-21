import { pino } from "pino"
import { APP_NAME } from "./common";

const LOG_LEVEL = process.env.LOG_LEVEL || "debug";

export const logger = pino({
    name: APP_NAME,
    level: LOG_LEVEL,
});