import { Bezier2d } from "src/bezier2d";
import { CatmullRomSpline2d } from "src/catmull-rom-spline2d";
import { CurveBase2d } from "src/curve-base2d";
import { PolyCurve2d } from "src/poly-curve2d";
import { Vec2d, Vec2dLike } from "src/vec2d";

export class Catmull2d extends PolyCurve2d<CatmullRomSpline2d> {
  constructor(points: Vec2dLike[]) {
    super([]);
    this.points = points;
  }

  public clone(): this {
    const copy = new Catmull2d(this.points);
    copy._curves = this._curves.map((curve) => curve.clone());
    return this._applyClone(copy as this);
  }

  public get points(): Vec2d[] {
    const curves = this._curves;
    const [, ...last] = curves[curves.length - 1].points;
    return [...curves.map((curve) => curve.points[0]), ...last];
  }

  public set points(points: Vec2dLike[]) {
    const splines: CatmullRomSpline2d[] = [];
    for (let i = 0; i < points.length - 3; ++i)
      splines.push(new CatmullRomSpline2d(points.slice(i, i + 4) as any));
    this._curves = splines;
    this.invalidate();
  }

  public catmull(): Catmull2d {
    return this;
  }

  public beziers(): Bezier2d[] {
    return this._curves.map((curve) => curve.bezier);
  }

  public static fromPointsOnCurve(points: Vec2dLike[]) {
    points = points.map((point) => new Vec2d(point));
    if (points.length <= 1)
      throw new RangeError("Too few points to construct catmull curve with");
    const p0 = points[0] as Vec2d,
      p1 = points[1] as Vec2d,
      p2 = points[points.length - 2] as Vec2d,
      p3 = points[points.length - 1] as Vec2d;
    const d0 = p0.subtract(p1).multiplyValues(6),
      d1 = p3.subtract(p2).multiplyValues(6);
    const first = p0.add(d0),
      last = p3.add(d1);
    return new Catmull2d([first, ...points, last]);
  }

  public static fromCurve(
    curve: CurveBase2d,
    precision?: number,
    cache?: boolean
  ) {
    return Catmull2d.fromPointsOnCurve(curve.getLut(precision, cache));
  }
}
