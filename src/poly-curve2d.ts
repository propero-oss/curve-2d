import { CurveBase2d } from "src/curve-base2d";
import { Vec2d, Vec2dLike } from "src/vec2d";

const { floor } = Math;

export class PolyCurve2d<T extends CurveBase2d> extends CurveBase2d {
  protected _curves: T[];

  constructor(curves: T[]) {
    super();
    if (!curves.length)
      throw new Error("At least one curve required for poly curve");
    this._curves = curves.map((curve) => curve.clone()) as T[];
  }

  public clone(): this {
    return this._applyClone(new PolyCurve2d(this._curves) as this);
  }

  public get(t: number): Vec2d {
    const [curve, offset] = this._curveAndOffset(t);
    return curve.get(offset);
  }

  public getSegment(tStart: number, tEnd: number): CurveBase2d {
    if (tStart === tEnd) {
      const [curve, offset] = this._curveAndOffset(tStart);
      return curve.getSegment(offset, offset);
    }
    if (tStart === 0 && tEnd === 1) return this.clone();
    if (tStart > tEnd) return this.getSegment(tEnd, tStart).reverse();
    const [curveStart, offsetStart, indexStart] = this._curveAndOffset(tStart);
    const [curveEnd, offsetEnd, indexEnd] = this._curveAndOffset(tStart);
    if (indexStart === indexEnd)
      return curveStart.getSegment(offsetStart, offsetEnd);
    return new PolyCurve2d([
      curveStart.getSegment(offsetStart, 1),
      ...this._curves
        .slice(indexStart + 1, indexEnd - 1)
        .map((curve) => curve.clone()),
      curveEnd.getSegment(0, offsetEnd),
    ]);
  }

  protected _curveAndOffset(
    t: number
  ): [curve: T, offset: number, index: number] {
    const { _curves } = this;
    if (t === 0) return [_curves[0], 0, 0];
    if (t === 1) return [_curves[_curves.length - 1], 1, _curves.length - 1];
    const index = floor(t * _curves.length);
    return [_curves[index], t * _curves.length - index, index];
  }

  protected _applyReverse(curve: this): this {
    super._applyReverse(curve);
    curve._curves = curve._curves.map((curve) => curve.reverse());
    return curve;
  }

  public reverse(): this {
    return new PolyCurve2d(
      this._curves.map((curve) => curve.reverse()).reverse()
    ) as this;
  }

  public scale(factor: number, origin?: Vec2dLike): this {
    return new PolyCurve2d(
      this._curves.map((curve) => curve.scale(factor, origin))
    ) as this;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    return new PolyCurve2d(
      this._curves.map((curve) => curve.rotate(angle, origin))
    ) as this;
  }

  public translate(vector: Vec2dLike): this {
    return new PolyCurve2d(
      this._curves.map((curve) => curve.translate(vector))
    ) as this;
  }
}
