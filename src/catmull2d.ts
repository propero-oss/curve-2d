import { CatmullRomSpline2d } from "src/catmull-rom-spline2d";
import { CurveBase2d } from "src/curve-base2d";
import { PolyCurve2d } from "src/poly-curve2d";
import { Vec2dLike } from "src/vec2d";

export class Catmull2d extends PolyCurve2d<CatmullRomSpline2d> {
  constructor(points: Vec2dLike[]) {
    const splines: CatmullRomSpline2d[] = [];
    for (let i = 0; i < points.length - 3; ++i)
      splines.push(new CatmullRomSpline2d(points.slice(i, i + 3) as any));
    super(splines);
  }

  public beziers() {
    return this._curves.map((curve) => curve.bezier);
  }

  public clone(): this {
    const copy = new Catmull2d([]);
    copy._curves = this._curves.map((curve) => curve.clone());
    return this._applyClone(copy as this);
  }
}

CurveBase2d.prototype.catmull = function catmull(precision?: number) {
  const lut = this.getLut(precision, false);
  if (lut.length === 1) return new Catmull2d([lut[0], lut[0], lut[0], lut[0]]);
  const p0 = lut[0],
    p1 = lut[1],
    p2 = lut[lut.length - 2],
    p3 = lut[lut.length - 1];
  const d0 = p0.subtract(p1).multiplyValues(6),
    d1 = p3.subtract(p2).multiplyValues(6);
  const first = p0.add(d0),
    last = p3.add(d1);
  return new Catmull2d([first, ...lut, last]);
};
