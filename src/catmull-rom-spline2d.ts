import { Bezier2d } from "src/bezier2d";
import { Curve2d } from "src/curve2d";
import { invalidatingAccessors } from "src/invalidating-accessors";
import { Vec2d, Vec2dLike } from "src/vec2d";

const { pow } = Math;

export class CatmullRomSpline2d extends Curve2d {
  @invalidatingAccessors("alpha")
  protected _alpha: number;
  public alpha!: number;

  constructor(
    points: [Vec2dLike, Vec2dLike, Vec2dLike, Vec2dLike],
    alpha: number = 0.5
  ) {
    super(points);
    this._alpha = alpha;
  }

  public clone() {
    const { _points, alpha } = this;
    return this._applyClone(
      new CatmullRomSpline2d(_points as any, alpha) as this
    );
  }

  public get(t: number): Vec2d {
    const {
      _points: [p0, p1, p2, p3],
      _alpha,
    } = this;
    const { _knotInterval, _remap } = CatmullRomSpline2d;

    if (t === 0) return p1;
    if (t === 1) return p2;

    // https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline#Definition
    // get knots
    const k0 = 0;
    const k1 = _knotInterval(p0, p1, _alpha);
    const k2 = _knotInterval(p1, p2, _alpha) + k1;
    const k3 = _knotInterval(p2, p3, _alpha) + k2;

    // get point
    const u = (k2 - k1) * t + k1;
    const a1 = _remap(p0, p1, k0, k1, u);
    const a2 = _remap(p1, p2, k1, k2, u);
    const a3 = _remap(p2, p3, k2, k3, u);
    const b1 = _remap(a1, a2, k0, k2, u);
    const b2 = _remap(a2, a3, k1, k3, u);
    return _remap(b1, b2, k1, k2, u);
  }

  public getSegment(tStart: number, tEnd: number): Bezier2d {
    return this.bezier.getSegment(tStart, tEnd);
  }

  public get bezier(): Bezier2d {
    const {
      _points: [p0, p1, p2, p3],
      alpha,
    } = this;
    const a0 = p1.add(p2.subtract(p0).divideValues(alpha * 6));
    const a1 = p2.subtract(p3.subtract(p1).divideValues(alpha * 6));
    return new Bezier2d([p1, a0, a1, p2]);
  }

  public beziers(): Bezier2d[] {
    return [this.bezier];
  }

  private static _knotInterval(p1: Vec2d, p2: Vec2d, alpha: number): number {
    return pow(p2.distance(p1), alpha);
  }

  private static _remap(
    p0: Vec2d,
    p1: Vec2d,
    a: number,
    b: number,
    u: number
  ): Vec2d {
    return p0.lerp(p1, (u - a) / (b - a));
  }
}
