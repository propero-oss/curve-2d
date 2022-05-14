import { angleBetween, clamp, clampAngle, clampModulo, lerp } from "src/util";

function deg(n: number) {
  return (n / 180) * Math.PI;
}

describe("angleBetween", () => {
  it("should determine whether an angle is between two angles", () => {
    expect(angleBetween(deg(10), deg(0), deg(20))).toBeTruthy();
    expect(angleBetween(deg(10), deg(350), deg(20))).toBeTruthy();
    expect(angleBetween(deg(350), deg(340), deg(10))).toBeTruthy();

    expect(angleBetween(deg(20), deg(0), deg(10))).toBeFalsy();
    expect(angleBetween(deg(350), deg(0), deg(10))).toBeFalsy();
    expect(angleBetween(deg(20), deg(350), deg(10))).toBeFalsy();
  });
});

describe("lerp", () => {
  it("should lerp between two values within bounds", () => {
    expect(lerp(10, 20, 0.5)).toBeCloseTo(15, 6);
    expect(lerp(10, -10, 0.75)).toBeCloseTo(-5, 6);
  });
  it("should lerp values outside of given bounds", () => {
    expect(lerp(0, 1, -1)).toBeCloseTo(-1, 6);
    expect(lerp(0, 1, 2)).toBeCloseTo(2, 6);
  });
});

describe("clamp", () => {
  it("should clap values to a given range", () => {
    expect(clamp(2, 0, 5)).toBe(2);
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-100, -10, 10)).toBe(-10);
  });
});

describe("clampModulo", () => {
  it("should cycle values between modulo bounds", () => {
    expect(clampModulo(13, 0, 5)).toBeCloseTo(3, 6);
    expect(clampModulo(11, 2, 6)).toBeCloseTo(3, 6);
    expect(clampModulo(-5, 2, 6)).toBeCloseTo(3, 6);
  });
});

describe("clampAngle", () => {
  it("should clamp an angle between 0 and 2*Math.PI", () => {
    expect(clampAngle(deg(-10))).toBeCloseTo(deg(350), 6);
    expect(clampAngle(deg(370))).toBeCloseTo(deg(10), 6);
    expect(clampAngle(deg(170))).toBeCloseTo(deg(170), 6);
  });
});
