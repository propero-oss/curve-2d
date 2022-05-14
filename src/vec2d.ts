import { lerp } from "src/util";

const { atan2, sqrt, pow, cos, sin, PI } = Math;
const taw = PI * 2;

export interface Vec2dLike {
  x: number;
  y: number;
}

export class Vec2d {
  x: number;
  y: number;

  public constructor();
  public constructor(x: number, y: number);
  public constructor(init: Vec2dLike);
  public constructor(init: [x: number, y: number]);
  constructor(initOrX?: number | Vec2dLike | [number, number], y?: number) {
    if (typeof initOrX === "object") {
      if (Array.isArray(initOrX)) {
        this.x = initOrX[0] ?? 0;
        this.y = initOrX[1] ?? 0;
      } else {
        this.x = initOrX.x ?? 0;
        this.y = initOrX.y ?? 0;
      }
    } else {
      this.x = initOrX ?? 0;
      this.y = y ?? 0;
    }
  }

  public clone() {
    return new Vec2d(this);
  }

  public get angle(): number {
    const angle = atan2(this.x, this.y);
    return angle < 0 ? angle + taw : angle;
  }

  public set angle(val: number) {
    const len = this.length;
    this.x = sin(val) * len;
    this.y = cos(val) * len;
  }

  public get length(): number {
    return sqrt(pow(this.x, 2) + pow(this.y, 2));
  }

  public set length(val: number) {
    const angle = this.angle;
    this.x = sin(angle) * val;
    this.y = cos(angle) * val;
  }

  public get normal(): Vec2d {
    return Vec2d.fromAngle(this.angle);
  }

  public get values(): [number, number] {
    return [this.x, this.y];
  }

  public rotate(angle: number, origin: Vec2dLike = { x: 0, y: 0 }): Vec2d {
    const offset = this.subtract(origin);
    offset.angle += angle;
    return offset.add(origin);
  }

  public add(other: Vec2dLike): Vec2d {
    return new Vec2d(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vec2dLike): Vec2d {
    return new Vec2d(this.x - other.x, this.y - other.y);
  }

  public distance(other: Vec2dLike): number {
    return sqrt(pow(this.x - other.x, 2) + pow(this.y - other.y, 2));
  }

  public scale(factor: number, origin: Vec2dLike = { x: 0, y: 0 }): Vec2d {
    const direction = this.subtract(origin);
    direction.length *= factor;
    return direction.add(origin);
  }

  public exponentiate(exponent: number): Vec2d {
    return Vec2d.fromAngle(this.angle, pow(this.length, exponent));
  }

  public multiplySymmetric(other: Vec2dLike): Vec2d {
    return new Vec2d(this.x * other.x, this.y * other.y);
  }

  public multiplyAsymmetric(other: Vec2dLike): Vec2d {
    return new Vec2d(this.x * other.y, this.y * other.x);
  }

  public multiplyValues(factor: number) {
    return new Vec2d(this.x * factor, this.y * factor);
  }

  public divideValues(divisor: number) {
    return new Vec2d(this.x / divisor, this.y / divisor);
  }

  public lerp(other: Vec2dLike, value: number) {
    return new Vec2d(
      lerp(this.x, other.x, value),
      lerp(this.y, other.y, value)
    );
  }

  static fromAngle(angle: number, distance = 1): Vec2d {
    return new Vec2d(sin(angle) * distance, cos(angle) * distance);
  }
}
