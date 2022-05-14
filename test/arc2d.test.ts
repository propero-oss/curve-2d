import { Arc2d, clampAngle, Vec2d, Vec2dLike } from "src/index";
import { vectorRoughlyEquals } from "test/util";

function deg2rad(deg: number, radius = 1, origin?: Vec2dLike) {
  return Vec2d.fromAngle((deg / 180) * Math.PI, radius).add(
    origin ?? { x: 0, y: 0 }
  );
}

describe("Arc2d", () => {
  it("should calculate points on a clockwise arc", () => {
    const arc0 = new Arc2d(new Vec2d(0, 0), 1, deg2rad(90), deg2rad(270));
    vectorRoughlyEquals(arc0.get(0), deg2rad(90));
    vectorRoughlyEquals(arc0.get(0.5), deg2rad(180));
    vectorRoughlyEquals(arc0.get(1), deg2rad(270));
    const arc1 = new Arc2d(new Vec2d(0, 0), 1, deg2rad(270), deg2rad(90));
    vectorRoughlyEquals(arc1.get(0), deg2rad(270));
    vectorRoughlyEquals(arc1.get(0.5), deg2rad(0));
    vectorRoughlyEquals(arc1.get(1), deg2rad(90));
  });
  it("should calculate points on a counter clockwise arc", () => {
    const arc0 = new Arc2d(new Vec2d(0, 0), 1, deg2rad(270), deg2rad(90), true);
    vectorRoughlyEquals(arc0.get(0), deg2rad(270));
    vectorRoughlyEquals(arc0.get(0.5), deg2rad(180));
    vectorRoughlyEquals(arc0.get(1), deg2rad(90));
    const arc1 = new Arc2d(new Vec2d(0, 0), 1, deg2rad(90), deg2rad(270), true);
    vectorRoughlyEquals(arc1.get(0), deg2rad(90));
    vectorRoughlyEquals(arc1.get(0.5), deg2rad(0));
    vectorRoughlyEquals(arc1.get(1), deg2rad(270));
  });
  it("should clone arcs completely", () => {
    const arc0 = new Arc2d(new Vec2d(5, 2), 3, deg2rad(10), deg2rad(15), true);
    const arc1 = new Arc2d(new Vec2d(-19, 11), 1, deg2rad(270), deg2rad(99));
    const clone0 = arc0.clone();
    const clone1 = arc1.clone();
    for (let i = 0; i <= 1; i += 0.1) {
      vectorRoughlyEquals(clone0.get(i), arc0.get(i));
      vectorRoughlyEquals(clone1.get(i), arc1.get(i));
    }
  });
  it("should calculate the length of an arc", () => {
    const arc = new Arc2d(new Vec2d(5, 2), 3, deg2rad(90), deg2rad(0));
    const { angle, length } = deg2rad(90, 3);
    expect(arc.length()).toBeCloseTo(angle * length, 6);
  });
  it("should return a linear percentage fn", () => {
    const arc = new Arc2d(new Vec2d(5, 2), 3, deg2rad(90), deg2rad(0));
    const fn = arc.getPercentageFn();
    for (let i = 0; i <= 1; i += 0.1) expect(fn(i)).toBeCloseTo(i, 6);
  });
  it("should get values by percentage", () => {
    const arc = new Arc2d(new Vec2d(5, 2), 3, deg2rad(90), deg2rad(0));
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(arc.getByPercent(i), arc.get(i));
  });
  it("should be divisible into segment arcs", () => {
    const arc = new Arc2d(new Vec2d(5, 2), 3, deg2rad(90), deg2rad(0));
    const halfArc = arc.getSegment(0.25, 0.75);
    vectorRoughlyEquals(arc.get(0.25), halfArc.get(0));
    vectorRoughlyEquals(arc.get(0.5), halfArc.get(0.5));
    vectorRoughlyEquals(arc.get(0.75), halfArc.get(1));
  });
  it("should reverse an arc", () => {
    const arc = new Arc2d(new Vec2d(5, 2), 3, deg2rad(90), deg2rad(0));
    const reverse = arc.reverse();
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(arc.get(i), reverse.get(1 - i));
  });
  it("should rotate an arc", () => {
    const arc = new Arc2d(new Vec2d(0, 0), 3, deg2rad(180), deg2rad(0));
    const rotated = arc.rotate(deg2rad(45).angle);
    for (let i = 0.25; i <= 0.75; i += 0.05)
      vectorRoughlyEquals(rotated.get(i), arc.get(i + 0.25));
  });
  it("should scale an arc", () => {
    const arc = new Arc2d(new Vec2d(0, 0), 3, deg2rad(180), deg2rad(0));
    const scaled = arc.scale(2);
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(scaled.get(i), arc.get(i).scale(2));
  });
  it("should translate arcs", () => {
    const arc = new Arc2d(new Vec2d(0, 0), 3, deg2rad(180), deg2rad(0));
    const translated = arc.translate({ x: 2, y: -2 });
    for (let i = 0; i <= 1; i += 0.1)
      vectorRoughlyEquals(translated.get(i), arc.get(i).add({ x: 2, y: -2 }));
  });
  it("should calculate an arc from 3 points", () => {
    function testArc(
      origin: Vec2d,
      radius: number,
      startAngle: number,
      endAngle: number,
      reverse = false
    ) {
      const reference = new Arc2d(
        origin,
        radius,
        startAngle,
        endAngle,
        reverse
      );
      let deltaAngle = clampAngle(Math.abs(startAngle - endAngle));
      if (reverse) deltaAngle *= -1;
      const angle = clampAngle(
        startAngle + deltaAngle * (0.1 + Math.random() * 0.8)
      );
      const [start, middle, end] = [
        Vec2d.fromAngle(startAngle, radius),
        Vec2d.fromAngle(angle, radius),
        Vec2d.fromAngle(endAngle, radius),
      ].map((point) => origin.add(point));
      const arc = Arc2d.fromPoints(start, middle, end) as Arc2d;
      expect(arc["_radius"]).toBeCloseTo(reference["_radius"], 6);
      vectorRoughlyEquals(arc["_center"], reference["_center"]);
      expect(arc["_startAngle"]).toBeCloseTo(reference["_startAngle"], 6);
      expect(arc["_endAngle"]).toBeCloseTo(reference["_endAngle"], 6);
      expect(arc["_counterClockwise"]).toEqual(reference["_counterClockwise"]);
    }

    testArc(new Vec2d(0, 0), 1, 0, 180);
    testArc(new Vec2d(0, 0), 5, 0, 180);
    testArc(new Vec2d(0, 0), 5, 10, 25);
    testArc(new Vec2d(2, 5), 5, 10, 25);
    testArc(new Vec2d(2, 5), 5, 10, 25, false);
  });
});
