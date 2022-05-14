import { CurveBase2d } from "src/curve-base2d";
import { Vec2d, Vec2dLike } from "src/vec2d";

export class Line2d extends CurveBase2d {
  public start: Vec2d;
  public end: Vec2d;

  public constructor(start: Vec2dLike, end: Vec2dLike) {
    super();
    this.start = new Vec2d(start);
    this.end = new Vec2d(end);
  }

  public length(): number {
    return this.start.distance(this.end);
  }

  public getPercentageFn(): (percent: number) => number {
    return (t) => t;
  }

  public getByPercent(percent: number): Vec2d {
    return this.get(percent);
  }

  public clone(): this {
    return new Line2d(this.start, this.end) as this;
  }

  public get(t: number): Vec2d {
    return this.start.lerp(this.end, t);
  }

  public getSegment(tStart: number, tEnd: number) {
    return new Line2d(this.get(tStart), this.get(tEnd));
  }

  public reverse(): this {
    return new Line2d(this.end, this.start) as this;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    return new Line2d(
      this.start.rotate(angle, origin),
      this.end.rotate(angle, origin)
    ) as this;
  }

  public scale(factor: number, origin?: Vec2dLike): this {
    return new Line2d(
      this.start.scale(factor, origin),
      this.end.scale(factor, origin)
    ) as this;
  }

  public translate(vector: Vec2dLike): this {
    return new Line2d(this.start.add(vector), this.end.add(vector)) as this;
  }
}
