import p5 from "p5";
import { ROUNDED_EDGE_VALUE } from "../constant/common";

export interface Cell {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export class Grid {

  public readonly xDimCount: number;
  public readonly yDimCount: number;

  // TODO: Abstract this into a separate object.
  private cells: Array<Array<Cell>>;

  constructor(xDimCount: number, yDimCount: number) {
    this.xDimCount = xDimCount;
    this.yDimCount = yDimCount;

    this.initArray();
  }

  private initArray() {
    this.cells = new Array<Array<Cell>>();
    for (let y = 0; y < this.yDimCount; y += 1) {
      const subArray = new Array<Cell>();
      for (let x = 0; x < this.xDimCount; x += 1) {
        subArray.push(
          {
            r: 255,
            g: 255,
            b: 255,
            a: 255,
          }
        );
      }
      this.cells.push(subArray);
    }
  }

  public getCellAtCoordinates(x: number, y: number) {
    const coordinate = this.cells[y][x];
    // TODO: error check.
    return coordinate;
  }

  public setCells(uppdatedCells: Array<Array<Cell>>) {
    if (this.cells.length !== uppdatedCells.length) {
      return false;
    }
    let isSameLength = true;
    uppdatedCells.forEach((value, index) => {
      isSameLength = isSameLength && this.cells[index].length == value.length;
    })
    if (isSameLength) {
      this.cells = uppdatedCells;
    }
    return isSameLength;
  }

}