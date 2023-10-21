import { logger } from "../constant/logger";
import { SERVER_COMMANDS } from "../constant/server";
import { Cell, Grid } from "../data/grid";

export class DrawClient {
  private websocket: WebSocket;
  private hostname: string;
  private grid: Grid;

  constructor(grid: Grid, port: number, host = "ws://localhost") {
    this.hostname = host + ":" + port.toString()
    this.grid = grid;
  }

  public startClient() {
    this.websocket = new WebSocket(this.hostname);

    this.websocket.onopen = (event) => {
      this.websocket.send(SERVER_COMMANDS.start);
    };

    this.websocket.onmessage = (event) => {
      logger.info(`Received message from server: ${event.timeStamp}`);
      const cells: Array<Array<Cell>> = JSON.parse(event.data);
      const didSetCells = this.grid.setCells(cells);
      const response = didSetCells ? "Successfully set image" : "Failed to set image, check dimensions";
      this.websocket.send(response);
    };

    this.websocket.onclose = (event) => {
      logger.info("Closing web socket");
    }
  }
}