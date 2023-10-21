import { X_DIM_PIXELS, Y_DIM_PIXELS } from "../constant/common";
import { STANDARD_PORT } from "../constant/server";
import { DrawServer } from "./drawServer";

const server: DrawServer = new DrawServer(X_DIM_PIXELS, Y_DIM_PIXELS, STANDARD_PORT);
server.startServer();