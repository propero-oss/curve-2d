import { CurveBase2d } from "src/curve-base2d";
import { invalidatingPoints } from "src/invalidating-accessors";
import { Vec2d, Vec2dLike } from "src/vec2d";

export abstract class Curve2d extends CurveBase2d {
  @invalidatingPoints("points")
  protected _points!: Vec2d[];
  public points!: Vec2d[];

  protected constructor(points: Vec2dLike[]) {
    super();
    this.points = points as Vec2d[];
  }

  public reverse() {
    return this._applyReverse(this.clone());
  }

  public scale(factor: number, origin: Vec2dLike): this {
    const copy = this.clone();
    copy.points = copy.points.map((point) => point.scale(factor, origin));
    copy.invalidate();
    return copy as this;
  }

  public rotate(angle: number, origin: Vec2dLike): this {
    const copy = this.clone();
    copy.points = copy.points.map((point) => point.rotate(angle, origin));
    copy.invalidate();
    return copy as this;
  }

  public translate(vector: Vec2dLike) {
    const copy = this.clone();
    copy.points = copy.points.map((point) => point.add(vector));
    copy.invalidate();
    return copy;
  }

  protected _applyReverse(curve: this) {
    curve = super._applyReverse(curve);
    curve._points?.reverse();
    return curve;
  }

  protected _applyClone(curve: this) {
    curve = super._applyClone(curve);
    curve._points = this._points.map((point) => new Vec2d(point));
    return curve;
  }
}
