import { CurveBase2d } from "src/curve-base2d";
import { Curve2d } from "src/curve2d";
import { Vec2d, Vec2dLike } from "src/vec2d";

export class Bezier2d extends Curve2d {
  public constructor(points: Vec2dLike[]) {
    super(points);
  }

  public get(t: number): Vec2d {
    const points = this._points;
    const order = this.order;

    if (t === 0) return points[0];
    if (t === 1) return points[order];

    switch (order) {
      case 0:
        return points[0];
      case 1:
        return points[0].lerp(points[1], t);
      case 2:
        return Bezier2d._getQuadratic(points[0], points[1], points[2], t);
      case 3:
        return Bezier2d._getCubic(
          points[0],
          points[1],
          points[2],
          points[3],
          t
        );
      default:
        return Bezier2d._getDeCasteljau(points, t);
    }
  }

  public getSegment(tStart: number, tEnd: number): this {
    // constant point
    if (tStart === tEnd) return new Bezier2d([this.get(tStart)]) as this;
    // reverse segment
    if (tStart > tEnd) return this.getSegment(tEnd, tStart).reverse();
    // just calculate upper bound points, lower is initial
    if (tStart === 0)
      return new Bezier2d(
        Bezier2d._getDeCasteljauPoints(this._points, tEnd)
      ) as this;
    // just calculate lower bound points, upper is initial
    if (tEnd === 1)
      return new Bezier2d(
        Bezier2d._getDeCasteljauPoints(
          this._points.slice().reverse(),
          1 - tStart
        )
      ).reverse() as this;
    // first calculate upper bounds
    const points = Bezier2d._getDeCasteljauPoints(this._points, tEnd).reverse();
    // then lower bounds
    return new Bezier2d(
      Bezier2d._getDeCasteljauPoints(points, (1 - tStart) * tEnd)
    ).reverse() as this;
  }

  public clone(): this {
    return this._applyClone(new Bezier2d(this._points) as this);
  }

  public get order(): number {
    return this._points.length - 1;
  }

  public length(precision?: number): number {
    const order = this.order;
    if (order === 0) return 0;
    if (order === 1) return this._points[0].distance(this._points[1]);
    return super.length(precision);
  }

  public catmull(precision: number = this._points.length + 2) {
    return super.catmull(precision);
  }

  public simplify(precision?: number): Bezier2d[] {
    return this.beziers(precision);
  }

  private static _getQuadratic(p0: Vec2d, p1: Vec2d, p2: Vec2d, t: number) {
    // implementation stolen and adapted from bezier-js
    const mt = 1 - t;
    const a = mt * mt;
    const b = mt * t * 2;
    const c = t * t;
    return new Vec2d(
      a * p0.x + b * p1.x + c * p2.x,
      a * p0.y + b * p1.y + c * p2.y
    );
  }

  private static _getCubic(
    p0: Vec2d,
    p1: Vec2d,
    p2: Vec2d,
    p3: Vec2d,
    t: number
  ) {
    // implementation stolen and adapted from bezier-js
    const mt = 1 - t,
      mt2 = mt * mt,
      t2 = t * t;

    const a = mt2 * mt;
    const b = mt2 * t * 3;
    const c = mt * t2 * 3;
    const d = t * t2;

    return new Vec2d(
      a * p0.x + b * p1.x + c * p3.x + d * p3.x,
      a * p0.y + b * p1.y + c * p2.y + d * p3.y
    );
  }

  private static _getDeCasteljau(points: Vec2d[], t: number) {
    // implementation stolen and adapted from bezier-js
    const p = points.slice();
    while (p.length > 1) {
      for (let i = 0; i < p.length - 1; ++i) p[i] = p[i].lerp(p[i + 1], t);
      p.splice(p.length - 1, 1);
    }
    return p[0];
  }

  private static _getDeCasteljauPoints(points: Vec2d[], t: number) {
    // to split a curve at point t, you have to calculate all the casteljau
    // points at that value, the resulting curve is of the same order and
    // ends at the point the curve would have had at t
    const p = points.slice();
    for (let upper = p.length - 1; upper > 0; --upper)
      for (let i = 0; i < upper - 1; ++i) p[i] = p[i].lerp(p[i + 1], t);
    return p;
  }
}

CurveBase2d.prototype.beziers = function beziers(
  precision?: number,
  cache?: boolean
): Bezier2d[] {
  return this.catmull(precision, cache).beziers();
};
