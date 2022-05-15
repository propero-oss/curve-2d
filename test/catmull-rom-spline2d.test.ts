import { CatmullRomSpline2d } from "src/catmull-rom-spline2d";
import { Vec2d } from "src/vec2d";
import { curveRoughlyEquals, range, vectorsRoughlyEqual } from "test/util";

describe("CatmullRomSpline2d", () => {
  it("should get points on a catmull rom path", () => {
    const spline = new CatmullRomSpline2d([
      new Vec2d(17.46, -8.94),
      new Vec2d(22.7, -5.1),
      new Vec2d(16.85, 5.7),
      new Vec2d(12.7, 3.5),
    ]);
    const points = [...range(0, 1, 0.1)].map(spline.get.bind(spline));
    vectorsRoughlyEqual(points, [
      new Vec2d(22.7, -5.1),
      new Vec2d(22.73200682, -4.19901368),
      new Vec2d(22.51447977, -3.06517075),
      new Vec2d(22.0895768, -1.77087463),
      new Vec2d(21.49945589, -0.38852874),
      new Vec2d(20.78627501, 1.00946349),
      new Vec2d(19.99219213, 2.35069864),
      new Vec2d(19.15936521, 3.5627733),
      new Vec2d(18.32995224, 4.57328402),
      new Vec2d(17.54611118, 5.3098274),
      new Vec2d(16.85, 5.7),
    ]);
  });
  it("should be cloned correctly", () => {
    const spline = new CatmullRomSpline2d(
      [
        new Vec2d(17.46, -8.94),
        new Vec2d(22.7, -5.1),
        new Vec2d(16.85, 5.7),
        new Vec2d(12.7, 3.5),
      ],
      0.33
    );
    const copy = spline.clone();
    expect(spline.points).toEqual(copy.points);
    expect(spline.alpha).toEqual(copy.alpha);
  });
  it("should invalidate cache on alpha set", () => {
    const spline = new CatmullRomSpline2d([
      new Vec2d(17.46, -8.94),
      new Vec2d(22.7, -5.1),
      new Vec2d(16.85, 5.7),
      new Vec2d(12.7, 3.5),
    ]);
    spline.getLut();
    expect(spline["_lut"]).toBeDefined();
    spline.alpha = 0.75;
    expect(spline["_lut"]).not.toBeDefined();
  });
  xit("should be convertible to a bezier curve", () => {
    const spline = new CatmullRomSpline2d([
      new Vec2d(17.46, -8.94),
      new Vec2d(22.7, -5.1),
      new Vec2d(16.85, 5.7),
      new Vec2d(12.7, 3.5),
    ]);
    const [bezier] = spline.beziers();
    curveRoughlyEquals(bezier, spline);
  });
  xit("should be able to be segmented", () => {
    const spline = new CatmullRomSpline2d([
      new Vec2d(17.46, -8.94),
      new Vec2d(22.7, -5.1),
      new Vec2d(16.85, 5.7),
      new Vec2d(12.7, 3.5),
    ]);
    const segment = spline.getSegment(0.2, 0.7);
    curveRoughlyEquals(segment, spline, [0.2, 0.7]);
  });
});
