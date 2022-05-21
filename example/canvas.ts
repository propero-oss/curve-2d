import { Arc2d } from "src/arc2d";
import { CurveBase2d } from "src/curve-base2d";
import { Curve2d } from "src/curve2d";
import { Vec2d } from "src/vec2d";

function drawShape(
  style: string,
  cxt: CanvasRenderingContext2D,
  draw: (cxt: CanvasRenderingContext2D) => void
) {
  const prev = cxt.strokeStyle;
  cxt.beginPath();
  cxt.strokeStyle = style;
  draw(cxt);
  cxt.stroke();
  cxt.strokeStyle = prev;
}

function moveToFirst(points: Vec2d[], cxt: CanvasRenderingContext2D) {
  cxt.moveTo(points[0].x, points[0].y);
}

export function drawCurve(
  curve: CurveBase2d,
  canvas: HTMLCanvasElement
): false | (() => void) {
  const cxt = canvas.getContext("2d")!;
  if (!cxt) return false;

  (canvas as any).__curve = curve;

  let frameId: number;
  function frame() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    drawShape("#000000", cxt, (cxt) => {
      const lut = curve.getLut();
      moveToFirst(lut, cxt);
      for (const point of lut) cxt.lineTo(point.x, point.y);
    });

    drawHandles(curve, cxt);

    frameId = requestAnimationFrame(frame);
  }

  frame();

  return () => cancelAnimationFrame(frameId);
}

export function createCanvas(title: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const container = document.createElement("article");
  const heading = document.createElement("h3");

  Object.assign(canvas, {
    width: 300,
    height: 300,
  });

  heading.innerText = title;
  container.append(heading, canvas);
  document.body.append(container);
  return canvas;
}

export function drawHandles(curve: CurveBase2d, cxt: CanvasRenderingContext2D) {
  if (curve instanceof Curve2d || "points" in curve) {
    const points = (curve as Curve2d).points;
    drawShape("rgba(0, 0, 0, .2)", cxt, (cxt) => {
      moveToFirst(points, cxt);
      for (const point of points) cxt.lineTo(point.x, point.y);
    });
    drawShape("rgba(255, 0, 0, 0.75)", cxt, (cxt) => {
      for (const point of points) {
        cxt.moveTo(point.x, point.y);
        cxt.arc(point.x, point.y, 3, 0, Math.PI * 2);
      }
    });
  }
}

export function curveCanvas(curve: CurveBase2d, title: string) {
  const canvas = createCanvas(title);
  const abort = drawCurve(curve, canvas);
  return [canvas, abort];
}
