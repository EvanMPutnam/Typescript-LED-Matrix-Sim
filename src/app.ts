import p5 from "p5";
import { Grid } from "./data/grid";
import { DrawClient } from "./client/drawClient";
import { DrawServer } from "./server/drawServer";
import { X_DIM_PIXELS, Y_DIM_PIXELS } from "./constant/common";
import { STANDARD_PORT } from "./constant/server";
import { LedView } from "./views/ledView";

const grid = new Grid(X_DIM_PIXELS, Y_DIM_PIXELS);
const ledView = new LedView(grid, 1920, 1080);
const sketch = (p: p5) => {

  p.keyPressed = () => {
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    ledView.resize(p.windowWidth, p.windowHeight);
  }

  p.setup = () => {
    ledView.resize(p.windowWidth, p.windowHeight);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0, 0, 1);
  };

  p.draw = () => {
    p.background(0, 0, 0); 
    ledView.draw(p);
  };
};

const client = new DrawClient(grid, STANDARD_PORT);
client.startClient();
new p5(sketch);