import { CurveBase2d } from "src/curve-base2d";
import { Line2d } from "src/line2d";
import { lerp } from "src/util";
import { Vec2d, Vec2dLike } from "src/vec2d";

const { abs, PI } = Math;
const piHalf = PI / 2;

export class Arc2d extends CurveBase2d {
  protected _center: Vec2d;
  protected _startAngle: Vec2d;
  protected _endAngle: Vec2d;
  protected _radius: number;

  constructor(
    center: Vec2dLike,
    radius: number,
    startAngle: number | Vec2dLike,
    endAngle: number | Vec2dLike
  ) {
    super();
    this._center = new Vec2d(center);
    this._radius = radius;
    this._startAngle =
      typeof startAngle === "number"
        ? Vec2d.fromAngle(startAngle)
        : new Vec2d(startAngle).normal;
    this._endAngle =
      typeof endAngle === "number"
        ? Vec2d.fromAngle(endAngle)
        : new Vec2d(endAngle).normal;
  }

  public clone(): this {
    const { _center, _radius, _startAngle, _endAngle } = this;
    return this._applyClone(
      new Arc2d(_center, _radius, _startAngle, _endAngle) as this
    );
  }

  public get(t: number): Vec2d {
    const { _startAngle, _endAngle, _center, _radius } = this;
    const angle = lerp(_startAngle.angle, _endAngle.angle, t);
    return _center.add(Vec2d.fromAngle(angle, _radius));
  }

  public length(): number {
    const { _radius, _startAngle, _endAngle } = this;
    return abs(_startAngle.angle - _endAngle.angle) * _radius;
  }

  public getPercentageFn(): (percent: number) => number {
    return (n) => n;
  }

  public getByPercent(percent: number): Vec2d {
    return this.get(percent);
  }

  public getSegment(tStart: number, tEnd: number): Arc2d {
    const { _startAngle, _endAngle, _center, _radius } = this;
    const aStart = lerp(_startAngle.angle, _endAngle.angle, tStart);
    const aEnd = lerp(_startAngle.angle, _endAngle.angle, tEnd);
    return new Arc2d(_center, _radius, aStart, aEnd);
  }

  public reverse(): this {
    const copy = this.clone();
    copy._endAngle = this._startAngle;
    copy._startAngle = this._endAngle;
    copy.invalidate();
    return copy;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    const copy = this.clone();
    copy._center = copy._center.rotate(angle, origin);
    copy._startAngle = copy._startAngle.rotate(angle);
    copy._endAngle = copy._endAngle.rotate(angle);
    copy.invalidate();
    return copy;
  }

  public scale(factor: number, origin?: Vec2dLike): this {
    const copy = this.clone();
    copy._center = copy._center.scale(factor, origin);
    copy._radius *= factor;
    copy.invalidate();
    return copy;
  }

  public translate(vector: Vec2dLike): this {
    const copy = this.clone();
    copy._center = copy._center.add(vector);
    copy.invalidate();
    return copy;
  }

  public static fromPoints(start: Vec2dLike, mid: Vec2dLike, end: Vec2dLike) {
    const linear = abs(
      (mid.y - start.y) * (end.x - start.x) -
        (mid.x - start.x) * (end.y - start.y)
    );

    if (linear > 0.01) return new Line2d(start, end);

    const startV = new Vec2d(start),
      midV = new Vec2d(mid),
      endV = new Vec2d(end);

    const midA = startV.add(midV).divideValues(2);
    const midB = endV.add(midV).divideValues(2);
    const normA = midV.subtract(startV).rotate(piHalf);
    const normB = midV.subtract(endV).rotate(piHalf);

    const slope = Arc2d._intersectionSlope(midA, normA, midB, normB);
    if (slope === undefined) return new Line2d(start, end);

    const center = midB.add(normB.multiplyValues(slope));
    const radius = center.distance(midV);

    return new Arc2d(
      center,
      radius,
      startV.subtract(center),
      endV.subtract(center)
    );
  }

  protected static _intersectionSlope(
    midA: Vec2d,
    normA: Vec2d,
    midB: Vec2d,
    normB: Vec2d
  ) {
    const des = normA.x * normB.y - normA.y * normB.x;
    if (abs(des) < 0.00001) return undefined;
    const { x, y } = normA.multiplyAsymmetric(midB.subtract(midA));
    return (x - y) / des;
  }
}
