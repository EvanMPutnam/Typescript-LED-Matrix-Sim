import p5 from "p5";
import { Grid } from "../data/grid";
import { ROUNDED_EDGE_VALUE } from "../constant/common";

export class LedView {
  private readonly grid: Grid;

  private singleXWidth: number;
  private singleYHeight: number;
  private xPaddingRatio: number;
  private yPaddingRatio: number;

  public constructor(grid: Grid,
    width: number, height: number,
    xPaddingRatio = 1 / 6, yPaddingRatio = 1 / 6) {
    this.grid = grid;

    this.singleXWidth = width / grid.xDimCount;
    this.singleYHeight = height / grid.yDimCount;

    this.xPaddingRatio = xPaddingRatio;
    this.yPaddingRatio = yPaddingRatio;
  }

  public resize(width: number, height: number) {
    this.singleXWidth = width / this.grid.xDimCount;
    this.singleYHeight = height / this.grid.yDimCount;
  }

  public draw(p: p5) {
    p.push()
    for (let y = 0; y < this.grid.yDimCount; y += 1) {
      for (let x = 0; x < this.grid.xDimCount; x += 1) {
        const xPadding = x == 0 ? 0 : this.singleXWidth * this.xPaddingRatio;
        const yPadding = y == 0 ? 0 : this.singleYHeight * this.yPaddingRatio;
        const xStart = x * this.singleXWidth;
        const yStart = y * this.singleYHeight;
        const cell = this.grid.getCellAtCoordinates(x, y);
        p.fill(cell.r, cell.g, cell.b, cell.a);
        p.rect(xStart + xPadding, yStart + yPadding,
          this.singleXWidth - xPadding, this.singleYHeight - yPadding,
          ROUNDED_EDGE_VALUE)
      }
    }
    p.pop()
  }
}