import { Catmull2d } from "src/catmull2d";
import { CurveBase2d } from "src/curve-base2d";
import { Line2d } from "src/line2d";
import { Vec2d } from "src/vec2d";

function beziers(this: CurveBase2d, precision?: number, cache?: boolean) {
  return this.catmull(precision, cache).beziers();
}

function catmull(this: CurveBase2d, precision?: number, cache?: boolean) {
  return Catmull2d.fromCurve(this, precision, cache);
}

function tangent(this: CurveBase2d, t: number, threshold: number = 0.0000001) {
  const lowerT = t < threshold ? t : t - threshold;
  const higherT = t > 1 - threshold ? t : t + threshold;
  const lower = this.get(lowerT);
  const higher = this.get(higherT);

  const direction = higher.subtract(lower);
  const length = direction.length / (higherT - lowerT);

  const p0 = lower.lerp(higher, 0.5);
  const p1 = lower.add(Vec2d.fromAngle(direction.angle, length));

  return new Line2d(p0, p1);
}

Object.defineProperties(CurveBase2d.prototype, {
  beziers: {
    value: beziers,
    enumerable: false,
  },
  catmull: {
    value: catmull,
    enumerable: false,
  },
  tangent: {
    value: tangent,
    enumerable: false,
  },
});
