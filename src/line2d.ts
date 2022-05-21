import { CurveBase2d } from "src/curve-base2d";
import { invalidatingPoint } from "src/invalidating-accessors";
import { Vec2d, Vec2dLike } from "src/vec2d";

export class Line2d extends CurveBase2d {
  @invalidatingPoint("start")
  protected _start: Vec2d;
  public start!: Vec2d;

  @invalidatingPoint("end")
  protected _end: Vec2d;
  public end!: Vec2d;

  public constructor(start: Vec2dLike, end: Vec2dLike) {
    super();
    this._start = new Vec2d(start);
    this._end = new Vec2d(end);
  }

  public length(): number {
    return this._start.distance(this._end);
  }

  public getPercentageFn(): (percent: number) => number {
    return (t) => t;
  }

  public getByPercent(percent: number): Vec2d {
    return this.get(percent);
  }

  public clone(): this {
    return new Line2d(this._start, this._end) as this;
  }

  public get(t: number): Vec2d {
    return this._start.lerp(this._end, t);
  }

  public getSegment(tStart: number, tEnd: number) {
    return new Line2d(this.get(tStart), this.get(tEnd));
  }

  public reverse(): this {
    return new Line2d(this._end, this._start) as this;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    return new Line2d(
      this._start.rotate(angle, origin),
      this._end.rotate(angle, origin)
    ) as this;
  }

  public scale(factor: number, origin?: Vec2dLike): this {
    return new Line2d(
      this._start.scale(factor, origin),
      this._end.scale(factor, origin)
    ) as this;
  }

  public translate(vector: Vec2dLike): this {
    return new Line2d(this._start.add(vector), this._end.add(vector)) as this;
  }
}
