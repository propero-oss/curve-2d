import type { Bezier2d } from "src/bezier2d";
import type { Catmull2d } from "src/catmull2d";
import { lerp } from "src/util";
import { Vec2d, Vec2dLike } from "src/vec2d";

const { min, abs } = Math;

export abstract class CurveBase2d {
  protected _length?: number;
  protected _lut?: Vec2d[];
  protected _percentFn?: (percent: number) => number;

  public abstract getSegment(tStart: number, tEnd: number): CurveBase2d;
  public abstract get(t: number): Vec2d;
  public abstract clone(): this;
  public abstract reverse(): this;
  public abstract scale(factor: number, origin?: Vec2dLike): this;
  public abstract rotate(angle: number, origin?: Vec2dLike): this;
  public abstract translate(vector: Vec2dLike): this;

  public invalidate() {
    this._length = this._lut = this._percentFn = undefined;
  }

  public defaultPrecision(): number {
    return 100;
  }

  public length(precision?: number): number {
    if (this._length !== undefined) return this._length;
    const lut = this.getLut(precision);
    let len = 0;
    for (let i = 0; i < lut.length - 1; ++i) len += lut[i].distance(lut[i + 1]);
    return (this._length = len);
  }

  public getLut(
    precision: number = this.defaultPrecision(),
    cache = true
  ): Vec2d[] {
    if (!precision) return [this.get(0), this.get(1)];
    if (this._lut?.length === precision + 1) return this._lut;
    const step = 1 / precision;
    const lut = Array.from({ length: precision + 1 }, (_, i) =>
      this.get(min(1, i * step))
    );
    if (cache) {
      this._lut = lut;
      this._length = this._percentFn = undefined;
    }
    return lut;
  }

  public split(t: number): [CurveBase2d, CurveBase2d] {
    return [this.getSegment(0, t), this.getSegment(t, 1)];
  }

  public getPercentageFn(precision?: number): (percent: number) => number {
    const lut = this.getLut(precision);
    if (this._percentFn) return this._percentFn;
    const percentLookup = CurveBase2d._getCumulativeLut(lut);

    return (this._percentFn = (n) => {
      if (n >= 0.999) return 1;
      if (n <= 0.001) return 0;

      const [[first, firstT], [second, secondT]] = percentLookup.sort(
        ([a], [b]) => {
          return abs(a - n) - abs(b - n);
        }
      );
      const dFirst = abs(n - first);
      const dSecond = abs(n - second);

      return lerp(firstT, secondT, dFirst / (dFirst + dSecond));
    });
  }

  public getByPercent(percent: number, precision?: number): Vec2d {
    return this.get(this.getPercentageFn(precision)(percent));
  }

  protected _applyReverse(curve: this): this {
    curve._lut?.reverse();
    if (curve._percentFn) {
      const fn = curve._percentFn;
      if ("__reverse" in fn) curve._percentFn = (fn as any).__reverse;
      else {
        curve._percentFn = (t) => 1 - fn(1 - t);
        (curve._percentFn as any).__reverse = fn;
      }
    }
    return curve;
  }

  protected _applyClone(curve: this): this {
    curve._lut = this._lut?.map((point) => new Vec2d(point));
    curve._length = this._length;
    curve._percentFn = this._percentFn;
    return curve;
  }

  protected static _getCumulativeLut(lut: Vec2d[]) {
    const percentLookup: [number, number][] = Array(lut.length);
    const length = lut.length;
    const step = 1 / (lut.length - 1);
    let len = 0;
    for (let i = 0; i < lut.length - 1; ++i) len += lut[i].distance(lut[i + 1]);
    let last: Vec2d = lut[0],
      lastDistance = 0;
    percentLookup[0] = [0, 0];
    for (let i = 1; i < length; ++i) {
      percentLookup[i] = [
        (lastDistance += last.distance(lut[i])) / len,
        i * step,
      ];
      last = lut[i];
    }
    return percentLookup;
  }
}

export declare interface CurveBase2d {
  catmull(precision?: number, cache?: boolean): Catmull2d;
  beziers(precision?: number, cache?: boolean): Bezier2d[];
}
