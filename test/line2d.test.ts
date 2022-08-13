import { Line2d } from "src/line2d";
import { Vec2d } from "src/vec2d";
import { vectorRoughlyEquals } from "test/util";

describe("Line2d", () => {
  it("should get points along a line", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 10, y: 2 });
    vectorRoughlyEquals(line.get(0), new Vec2d(0, 0));
    vectorRoughlyEquals(line.get(0.2), new Vec2d(2, 0.4));
    vectorRoughlyEquals(line.get(0.4), new Vec2d(4, 0.8));
    vectorRoughlyEquals(line.get(0.6), new Vec2d(6, 1.2));
    vectorRoughlyEquals(line.get(0.8), new Vec2d(8, 1.6));
    vectorRoughlyEquals(line.get(1), new Vec2d(10, 2));
  });
  it("should calculate the length of a line", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(line.length()).toBeCloseTo(5, 6);
  });
  it("should return a pass-through percentage fn", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const fn = line.getPercentageFn();
    for (let i = 0; i <= 1; i += 1) expect(fn(i)).toBeCloseTo(i, 6);
  });
  it("should alias getByPercent to get", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 10, y: 2 });
    vectorRoughlyEquals(line.getByPercent(0), new Vec2d(0, 0));
    vectorRoughlyEquals(line.getByPercent(0.2), new Vec2d(2, 0.4));
    vectorRoughlyEquals(line.getByPercent(0.4), new Vec2d(4, 0.8));
    vectorRoughlyEquals(line.getByPercent(0.6), new Vec2d(6, 1.2));
    vectorRoughlyEquals(line.getByPercent(0.8), new Vec2d(8, 1.6));
    vectorRoughlyEquals(line.getByPercent(1), new Vec2d(10, 2));
  });
  it("should clone a line", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const copy = line.clone();
    vectorRoughlyEquals(line.start, copy.start);
    vectorRoughlyEquals(line.end, copy.end);
  });
  it("should calculate a subsegment of a line", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 10, y: 2 });
    const segment = line.getSegment(0.2, 0.6);
    vectorRoughlyEquals(segment.start, new Vec2d(2, 0.4));
    vectorRoughlyEquals(segment.end, new Vec2d(6, 1.2));
  });
  it("should reverse a line", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const copy = line.reverse();
    vectorRoughlyEquals(line.start, copy.end);
    vectorRoughlyEquals(line.start, copy.end);
  });
  it("should rotate a line around a pivot", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const angle = 1;
    const origin = new Vec2d(12, -0.3);
    const rotated = line.rotate(angle, origin);
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(rotated.get(i), line.get(i).rotate(angle, origin));
  });
  it("should scale a line from a given origin", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const factor = 1.8;
    const origin = new Vec2d(12, -0.3);
    const scaled = line.scale(factor, origin);
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(scaled.get(i), line.get(i).scale(factor, origin));
  });
  it("should translate a line by a given offset", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const offset = new Vec2d(-2.19, 555.003);
    const translated = line.translate(offset);
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(translated.get(i), line.get(i).add(offset));
  });
  it("should calculate a tangent", () => {
    const line = new Line2d({ x: 0, y: 0 }, { x: 3, y: 4 });
    const { start, direction } = line.tangent(0.5);
    vectorRoughlyEquals(start, { x: 1.5, y: 2 });
    vectorRoughlyEquals(direction, { x: 3, y: 4 });
  });
});
