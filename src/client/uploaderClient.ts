import Jimp from "jimp";
import { Cell } from "../data/grid";
import { WebSocket } from "ws";
import { SERVER_COMMANDS } from "../constant/server";
import { logger } from "../constant/logger";

export class UploaderClient {

  private readonly width: number;
  private readonly height: number;
  private readonly port: number;
  private readonly host: string;

  constructor(width: number, height: number, port: number, host = "ws://localhost") {
    this.width = width;
    this.height = height;
    this.port = port;
    this.host = host;
  }

  private createPixelArray(image) {
    const resizedImage = image.resize(this.width, this.height);
    const cellArray = new Array<Array<Cell>>();
    for(let y = 0; y < this.height; y += 1) {
      const subArray = new Array<Cell>();
      for (let x = 0; x < this.width; x += 1) {
        const rgbaData = Jimp.intToRGBA(resizedImage.getPixelColor(x, y))
        const cell: Cell = {
          r: rgbaData.r,
          g: rgbaData.g,
          b: rgbaData.b,
          a: rgbaData.a,
        }
        subArray.push(cell);
      }
      cellArray.push(subArray);
    }
    return cellArray;
  }

  public async uploadImage(path: string): Promise<boolean> {
    const image = await Jimp.read(path);
    const resizedImage = image.resize(this.width, this.height);
    const cellArray = this.createPixelArray(resizedImage);
    const wireData = JSON.stringify(cellArray);
    const webSocket = new WebSocket(this.host + ":" + this.port.toString());
    const result: boolean = await new Promise((resolve, reject) => {
      webSocket.onopen = () => {
        webSocket.send(SERVER_COMMANDS.upload);
      };
      webSocket.onmessage = (event) => {
        if (event.data === SERVER_COMMANDS.uploadReady) {
          webSocket.send(Buffer.from(JSON.stringify(wireData)));
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
    webSocket.close();
    logger.info(`Uploaded file status: ${result}`);
    return result;
  }
}