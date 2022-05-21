import { clampAngle } from "src/util";
import { Vec2d, Vec2dLike } from "src/vec2d";

export function invalidatingAccessors(name: string): PropertyDecorator {
  return function (proto, key) {
    Object.defineProperty(proto, name, {
      get: function () {
        return this[key];
      },
      set: function (value: unknown) {
        this[key] = value;
        (this as any).invalidate();
      },
    });
  };
}

export function invalidatingPoint(name: string): PropertyDecorator {
  return function (proto, key) {
    Object.defineProperty(proto, name, {
      get: function () {
        return this[key];
      },
      set: function (value: Vec2dLike) {
        this[key] = new Vec2d(value);
        this.invalidate();
      },
    });
  };
}

export function invalidatingPoints(name: string): PropertyDecorator {
  return function (proto, key) {
    Object.defineProperty(proto, name, {
      get: function () {
        return this[key].map((point: Vec2d) => new Vec2d(point));
      },
      set: function (value: Vec2dLike[]) {
        this[key] = value.map((point) => new Vec2d(point));
        this.invalidate();
      },
    });
  };
}

export function invalidatingAngle(name: string): PropertyDecorator {
  return function (proto, key) {
    Object.defineProperty(proto, name, {
      get: function () {
        return this[key];
      },
      set: function (value: number) {
        this[key] = clampAngle(value);
        this.invalidate();
      },
    });
  };
}
