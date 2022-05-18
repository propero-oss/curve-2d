import { Arc2d } from "src/arc2d";
import { Catmull2d } from "src/catmull2d";
import { PolyCurve2d } from "src/poly-curve2d";
import { Vec2d } from "src/vec2d";
import { curveRoughlyEquals, range, vectorsRoughlyEqual } from "test/util";

const examplePoints = [
  { x: 1, y: 4 },
  { x: 0, y: 0 },
  { x: 4, y: -1 },
  { x: 5, y: 3 },
  { x: 3, y: 2 },
  { x: 1, y: 4 },
  { x: 0, y: 0 },
  { x: 4, y: -1 },
];

describe("Catmull2d", () => {
  it("should construct a catmull curve", () => {
    const curve = new Catmull2d(examplePoints);
    expect(curve["_curves"].length).toEqual(5);
  });
  it("should draw a catmull curve", () => {
    const curve = new Catmull2d(examplePoints);
    const points = [...range(0, 1, 0.05)].map(curve.get.bind(curve));
    vectorsRoughlyEqual(points, [
      new Vec2d(0, 0),
      new Vec2d(0.71875, -0.578125),
      new Vec2d(1.875, -1),
      new Vec2d(3.09375, -1.171875),
      new Vec2d(4, -1),
      new Vec2d(4.56124612, -0.20692543),
      new Vec2d(4.95498965, 1.07319884),
      new Vec2d(5.12123836, 2.31672369),
      new Vec2d(5, 3),
      new Vec2d(4.65830833, 2.92402665),
      new Vec2d(4.13202229, 2.54572195),
      new Vec2d(3.5397251, 2.14455627),
      new Vec2d(3, 2),
      new Vec2d(2.45655461, 2.38022791),
      new Vec2d(1.91714547, 3.09411381),
      new Vec2d(1.4191636, 3.7609428),
      new Vec2d(1, 4),
      new Vec2d(0.52399392, 3.42309563),
      new Vec2d(0.09077238, 2.251085),
      new Vec2d(-0.13783535, 0.95353187),
    ]);
  });
  it("should return the correct points", () => {
    const curve = new Catmull2d(examplePoints);
    expect(curve.points).toEqual(examplePoints);
  });
  it("should overwrite existing points", () => {
    const curve = new Catmull2d([
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ]);
    expect(curve["_curves"].length).toEqual(1);
    curve.points = examplePoints;
    expect(curve["_curves"].length).toEqual(5);
  });
  it("should be able to be cloned", () => {
    const curve = new Catmull2d(examplePoints);
    const copy = curve.clone();
    expect(curve).toEqual(copy);
  });
  it("should be constructable from points on a curve", () => {
    const curve = new Arc2d({ x: 0, y: 0 }, 5, 0, Math.PI);
    const catmull = Catmull2d.fromPointsOnCurve(curve.getLut());
    curveRoughlyEquals(catmull, curve);
  });
  it("should be constructable approximating another curve", () => {
    const curve = new Arc2d({ x: 0, y: 0 }, 5, 0, Math.PI);
    const catmull = Catmull2d.fromCurve(curve);
    curveRoughlyEquals(catmull, curve);
  });
  it("should convert any curve to catmull", () => {
    const curve = new Arc2d({ x: 0, y: 0 }, 5, 0, Math.PI);
    const catmull = curve.catmull(100);
    curveRoughlyEquals(catmull, curve);
    expect(catmull.catmull()).toBe(catmull);
  });
  it("should throw if not enough points are provided", () => {
    expect(() => Catmull2d.fromPointsOnCurve([])).toThrow();
  });
  xit("should convert to bezier curves", () => {
    const curve = new Catmull2d(examplePoints);
    const beziers = curve.beziers();
    expect(beziers.length).toBe(5);
    curveRoughlyEquals(new PolyCurve2d(beziers), curve);
  });
});
