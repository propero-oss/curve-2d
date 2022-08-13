import { Arc2d } from "src/arc2d";
import { Bezier2d } from "src/bezier2d";
import { CatmullRomSpline2d } from "src/catmull-rom-spline2d";
import { Catmull2d } from "src/catmull2d";
import { Line2d } from "src/line2d";
import { curveCanvas } from "example/canvas";
import { PolyCurve2d } from "src/poly-curve2d";

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
  curveCanvas(
    new Catmull2d([
      { x: 50, y: 200 },
      { x: 250, y: 50 },
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 50, y: 200 },
      { x: 250, y: 50 },
      { x: 100, y: 100 },
    ]),
    "Catmull Rom Curve"
  );
  curveCanvas(
    Catmull2d.fromCurve(
      new Bezier2d([
        { x: 50, y: 200 },
        { x: 250, y: 50 },
        { x: 250, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 250 },
        { x: 150, y: 250 },
      ]),
      15
    ),
    "Catmull from Curve"
  );
  curveCanvas(
    new Bezier2d([
      { x: 50, y: 200 },
      { x: 250, y: 50 },
      { x: 250, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 250 },
      { x: 150, y: 250 },
    ]),
    "Bezier"
  );
}

document.addEventListener("DOMContentLoaded", init);
