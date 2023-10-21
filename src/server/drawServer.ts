import WebSocket, { WebSocketServer } from "ws";
import { Cell } from "../data/grid";
import { SERVER_COMMANDS } from "../constant/server";
import { randomIntFromInterval } from "../util/util";
import { logger } from "../constant/logger";

interface ServerState {
  startedServing: boolean;
  awaitingUpload: boolean;
}

export class DrawServer {
  private websocket: WebSocketServer;
  private port: number;
  private isInitialized = false;
  private xDim: number;
  private yDim: number;
  
  private imageToServe: Array<Array<Cell>> | undefined = undefined;

  constructor(xDim: number, yDim: number, port: number) {
    this.port = port;
    this.xDim = xDim;
    this.yDim = yDim;
  }

  public startServer() {
    logger.info("Starting server");
    if (!this.isInitialized) {
      this.websocket = new WebSocketServer({ port: this.port })
      this.configureServerActions();
    }
    this.isInitialized = true;
    logger.info("Server started");
  }

  private createRandomCells() {
    const cells = new Array<Array<Cell>>();
    for (let y = 0; y < this.yDim; y += 1) {
      const subArray = new Array<Cell>();
      for (let x = 0; x < this.xDim; x += 1) {
        subArray.push(
          {
            r: randomIntFromInterval(0, 255),
            g: randomIntFromInterval(0, 255),
            b: randomIntFromInterval(0, 255),
          }
        );
      }
      cells.push(subArray);
    }
    return cells
  }

  private serverMessageActions(ws: WebSocket, serverState: ServerState, parsedMessage: string) {
    if (serverState.awaitingUpload) {
      this.imageToServe = JSON.parse(JSON.parse(parsedMessage))
      serverState.awaitingUpload = false;
      logger.info("New image uploaded");
      return;
    }
    if (parsedMessage == SERVER_COMMANDS.start && !serverState.startedServing) {
      serverState.startedServing = true;
      setInterval(() => {
        ws.send(JSON.stringify(this.imageToServe || this.createRandomCells()));
      }, 1000);
    } else if (parsedMessage == SERVER_COMMANDS.upload) {
      serverState.awaitingUpload = true;
      ws.send(SERVER_COMMANDS.uploadReady);
      return;
    }
    logger.info(parsedMessage);
  }

  private configureServerActions() {
    this.websocket.on('connection', (ws: WebSocket) => {
      const serverState: ServerState = {
        startedServing: false,
        awaitingUpload: false,
      }
      logger.info('New client connected');
      ws.on('message', (message: any) => {
        const parsedMessage: string = message.toString();
        this.serverMessageActions(ws, serverState, parsedMessage);
      });

      ws.on('close', () => {
        logger.info('Client disconnected');
      });
    });
  }
}