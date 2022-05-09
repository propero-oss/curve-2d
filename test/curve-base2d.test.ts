import { CurveBase2d, Vec2d, Vec2dLike } from "src/index";

class CurveBase2dTest extends CurveBase2d {
  public clone(): this {
    return this;
  }

  public get(t: number): Vec2d {
    return new Vec2d(t, t);
  }

  public getSegment(tStart: number, tEnd: number): CurveBase2d {
    return this;
  }

  public reverse(): this {
    return this;
  }

  public rotate(angle: number, origin?: Vec2dLike): this {
    return this;
  }

  public scale(factor: number, origin?: Vec2dLike): this {
    return this;
  }

  public translate(vector: Vec2dLike): this {
    return this;
  }
}

describe("CurveBase2d", () => {
  it("should invalidate cached results", () => {
    const c = jest.mocked(new CurveBase2dTest());
    c["_lut"] = [];
    c.invalidate();
    expect(c["_lut"]).not.toBeDefined();
  });
  it("should calculate a lut of a given precision", () => {
    expect(new CurveBase2dTest().getLut(2)).toEqual([
      new Vec2d(0, 0),
      new Vec2d(0.5, 0.5),
      new Vec2d(1, 1),
    ]);
  });
  it("should approximate length based on calculated points from lut", () => {
    expect(new CurveBase2dTest().length()).toBeCloseTo(Math.SQRT2);
  });
  it("should approximate a conversion method from percentage length to t value", () => {
    const fn = new CurveBase2dTest().getPercentageFn();
    expect(fn(0.4)).toBeCloseTo(0.4, 6);
  });
  it("should approximate a point on a curve based on a percentage", () => {
    expect(new CurveBase2dTest().getByPercent(0.7).x).toBeCloseTo(0.7);
  });
  it("should split a curve", () => {
    const mock = new CurveBase2dTest();
    jest.spyOn(mock, "getSegment");
    mock.split(0.3);
    expect(mock.getSegment).toHaveBeenCalledTimes(2);
    expect(mock.getSegment).toHaveBeenNthCalledWith(1, 0, 0.3);
    expect(mock.getSegment).toHaveBeenNthCalledWith(2, 0.3, 1);
  });
  it("should clone precalculated values", () => {
    const c = new CurveBase2dTest();
    c.length();
    c.getPercentageFn();
    expect(c["_lut"]).toBeDefined();
    expect(c["_length"]).toBeDefined();
    expect(c["_percentFn"]).toBeDefined();
    const d = new CurveBase2dTest();
    c["_applyClone"].call(c, d);
    expect(c["_lut"]).toEqual(d["_lut"]);
    expect(c["_length"]).toEqual(d["_length"]);
    expect(c["_percentFn"]).toEqual(d["_percentFn"]);
  });
  it("should reverse precalculated values", () => {
    const c = new CurveBase2dTest();
    c.length(2);
    c.getPercentageFn(2);
    expect(c["_lut"]).toBeDefined();
    expect(c["_length"]).toBeDefined();
    expect(c["_percentFn"]).toBeDefined();
    const d = new CurveBase2dTest();
    c["_applyClone"].call(c, d);
    c["_applyReverse"].call(c, d);
    expect(d["_length"]).toEqual(c["_length"]);
    expect(d["_percentFn"]!(0.2)).toBeCloseTo(c["_percentFn"]!(0.2), 6);
    expect(d["_lut"]![0]).toEqual(c["_lut"]![2]);
  });
});
