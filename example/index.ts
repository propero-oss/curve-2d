import { Arc2d } from "src/arc2d";
import { CatmullRomSpline2d } from "src/catmull-rom-spline2d";
import { Line2d } from "src/line2d";
import { curveCanvas } from "example/canvas";

function init() {
  curveCanvas(new Line2d({ x: 50, y: 100 }, { x: 200, y: 130 }), "Line");
  curveCanvas(new Arc2d({ x: 100, y: 100 }, 66.666, 0, Math.PI * 0.6), "Arc");
  curveCanvas(
    new CatmullRomSpline2d([
      { x: 250, y: 50 },
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 50, y: 200 },
    ]),
    "Catmull Rom Spline"
  );
}

document.addEventListener("DOMContentLoaded", init);
