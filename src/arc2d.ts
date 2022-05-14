import { CurveBase2d } from "src/curve-base2d";
import { Line2d } from "src/line2d";
import { angleBetween, clampAngle, clampModulo } from "src/util";
// import { Line2d } from "src/line2d";
import { Vec2d, Vec2dLike } from "src/vec2d";

const { abs, pow, sqrt, PI } = Math;
const taw = PI * 2;

export class Arc2d extends CurveBase2d {
  protected _center: Vec2d;
  protected _startAngle: number;
  protected _endAngle: number;
  protected _radius: number;
  protected _counterClockwise: boolean;

  constructor(
    center: Vec2dLike,
    radius: number,
    startAngle: number | Vec2dLike,
    endAngle: number | Vec2dLike,
    counterClockwise: boolean = false
  ) {
    super();
    this._center = new Vec2d(center);
    this._radius = radius;
    this._startAngle = clampAngle(
      typeof startAngle === "object" ? new Vec2d(startAngle).angle : startAngle
    );
    this._endAngle = clampAngle(
      typeof endAngle === "object" ? new Vec2d(endAngle).angle : endAngle
    );
    this._counterClockwise = counterClockwise;
  }

  public clone(): this {
    const { _center, _radius, _startAngle, _endAngle, _counterClockwise } =
      this;
    return this._applyClone(
      new Arc2d(
        _center,
        _radius,
        _startAngle,
        _endAngle,
        _counterClockwise
      ) as this
    );
  }

  public get(t: number): Vec2d {
    const { _startAngle, arcSpan, _center, _radius, _counterClockwise } = this;
    const angle = _counterClockwise
      ? _startAngle - arcSpan * t
      : _startAngle + arcSpan * t;
    return _center.add(Vec2d.fromAngle(angle, _radius));
  }

  public get arcSpan() {
    const { _startAngle, _endAngle, _counterClockwise } = this;
    let delta = abs(_endAngle - _startAngle);
    if (_counterClockwise && _endAngle > _startAngle) delta = taw - delta;
    else if (!_counterClockwise && _startAngle > _endAngle) delta = taw - delta;
    return delta;
  }

  public length(): number {
    const { _radius, _startAngle, _endAngle } = this;
    return abs(_startAngle - _endAngle) * _radius;
  }

  public getPercentageFn(): (percent: number) => number {
    return (n) => n;
  }

  public getByPercent(percent: number): Vec2d {
    return this.get(percent);
  }

  public getSegment(tStart: number, tEnd: number): Arc2d {
    const { _startAngle, arcSpan, _center, _radius, _counterClockwise } = this;
    const aStart = _startAngle + arcSpan * tStart;
    const aEnd = _startAngle + arcSpan * tEnd;
    return new Arc2d(_center, _radius, aStart, aEnd, _counterClockwise);
  }

  public reverse(): this {
    const copy = this.clone();
    copy._endAngle = this._startAngle;
    copy._startAngle = this._endAngle;
    copy._counterClockwise = !this._counterClockwise;
    copy.invalidate();
    return copy;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    const copy = this.clone();
    copy._center = copy._center.rotate(angle, origin);
    copy._startAngle = (copy._startAngle + angle) % taw;
    copy._endAngle = (copy._endAngle + angle) % taw;
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

  public static fromPoints(
    { x: x1, y: y1 }: Vec2dLike,
    { x: x2, y: y2 }: Vec2dLike,
    { x: x3, y: y3 }: Vec2dLike
  ) {
    const angle =
      clampModulo(new Vec2d(x2 - x1, y2 - y1).angle, 0, PI) -
      clampModulo(new Vec2d(x2 - x3, y2 - y3).angle, 0, PI);
    if (abs(angle) < 0.000001 || abs(abs(angle) - PI) < 0.000001)
      return new Line2d({ x: x1, y: y1 }, { x: x3, y: y3 });

    // snippet from https://www.geeksforgeeks.org/equation-of-circle-when-three-points-on-the-circle-are-given/
    const x12 = x1 - x2;
    const x13 = x1 - x3;

    const y12 = y1 - y2;
    const y13 = y1 - y3;

    const y31 = y3 - y1;
    const y21 = y2 - y1;

    const x31 = x3 - x1;
    const x21 = x2 - x1;

    const sx13 = pow(x1, 2) - pow(x3, 2);
    const sy13 = pow(y1, 2) - pow(y3, 2);

    const sx21 = pow(x2, 2) - pow(x1, 2);
    const sy21 = pow(y2, 2) - pow(y1, 2);

    const f =
      (sx13 * x12 + sy13 * x12 + sx21 * x13 + sy21 * x13) /
      (2 * (y31 * x12 - y21 * x13));
    const g =
      (sx13 * y12 + sy13 * y12 + sx21 * y13 + sy21 * y13) /
      (2 * (x31 * y12 - x21 * y13));

    const c = -pow(x1, 2) - pow(y1, 2) - 2 * g * x1 - 2 * f * y1;

    // eqn of circle be
    // x^2 + y^2 + 2*g*x + 2*f*y + c = 0
    // where centre is (h = -g, k = -f) and radius r
    // as r^2 = g^2 + f^2 - c
    const radius = sqrt(g * g + f * f - c);
    const center = new Vec2d(-g, -f);

    const angle1 = new Vec2d(x1, y1).subtract(center).angle;
    const angle2 = new Vec2d(x2, y2).subtract(center).angle;
    const angle3 = new Vec2d(x3, y3).subtract(center).angle;

    const cc = angleBetween(angle2, angle1, angle3, true);

    return new Arc2d(center, radius, angle1, angle3, cc);
  }
}
