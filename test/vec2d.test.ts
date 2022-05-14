import { Vec2d } from "src/vec2d";
import { vectorRoughlyEquals } from "test/util";

function simple({ x, y }: Vec2d) {
  return { x, y };
}

const vectors = [
  new Vec2d(-200, 100),
  new Vec2d(0.00000000001, -0.000000000233),
  new Vec2d(0, 0),
];
const angles = [5.17603658, 3.09870052, 0];
const lengths = [223.60679774, 2.332144935e-10, 0];

describe("Vec2d", () => {
  it("should be constructable", () => {
    const vectors = [
      new Vec2d(100, 200),
      new Vec2d({ x: 200, y: 300 }),
      new Vec2d([300, 200]),
    ];
    expect(vectors.map(simple)).toEqual([
      { x: 100, y: 200 },
      { x: 200, y: 300 },
      { x: 300, y: 200 },
    ]);
  });
  it("should calculate the correct angle for any vector", () => {
    for (let i = 0; i < vectors.length; ++i)
      expect(vectors[i].angle).toBeCloseTo(angles[i], 6);
  });
  it("should correctly modify a vector angle while preserving length", () => {
    const vs = vectors.map((v) => v.clone());
    for (const v of vs) v.angle += Math.random() * Math.PI * 2;
    for (let i = 0; i < vectors.length; ++i)
      expect(vs[i].length).toBeCloseTo(lengths[i], 6);
  });
  it("should correctly modify a vector length while preserving angle", () => {
    const vs = vectors.map((v) => v.clone());
    for (const v of vs) v.length += Math.max(0.00001, Math.random());
    for (let i = 0; i < vectors.length; ++i)
      expect(vs[i].angle).toBeCloseTo(angles[i], 6);
  });
  it("should normalize vectors but keep the angle", () => {
    const normal = vectors.map((v) => v.normal);
    for (let i = 0; i < vectors.length; ++i) {
      expect(normal[i].length).toBeCloseTo(1, 6);
      expect(normal[i].angle).toBeCloseTo(angles[i], 6);
    }
  });
  it("should unpack coordinates into an array", () => {
    expect(new Vec2d(400, 200).values).toEqual([400, 200]);
  });
  it("should rotate a vector around a pivot", () => {
    vectorRoughlyEquals(
      new Vec2d(200, 100).rotate(Math.PI * 0.5),
      new Vec2d(100, -200)
    );
    vectorRoughlyEquals(
      new Vec2d(200, 100).rotate(Math.PI, { x: 100, y: 0 }),
      new Vec2d(0, -100)
    );
  });
  it("should add two vectors correctly", () => {
    vectorRoughlyEquals(
      new Vec2d(100, 200).add({ x: -200, y: 250 }),
      new Vec2d(-100, 450)
    );
  });
  it("should subtract two vectors correctly", () => {
    vectorRoughlyEquals(
      new Vec2d(100, 200).subtract({ x: -200, y: 250 }),
      new Vec2d(300, -50)
    );
  });
  it("should calculate the distance between two vectors correclty", () => {
    expect(new Vec2d(10, 10).distance({ x: 20, y: 10 })).toBeCloseTo(10, 6);
    expect(new Vec2d(1, 2).distance({ x: 2, y: 1 })).toBeCloseTo(Math.SQRT2, 6);
  });
  it("should scale vectors correctly from an origin point", () => {
    vectorRoughlyEquals(new Vec2d(1, 5).scale(2), new Vec2d(2, 10));
    vectorRoughlyEquals(
      new Vec2d(1, 5).scale(2, { x: 1, y: 0 }),
      new Vec2d(1, 10)
    );
  });
  it("should exponentiate vector lengths correctly", () => {
    vectorRoughlyEquals(new Vec2d(2, 0).exponentiate(2), new Vec2d(4, 0));
    vectorRoughlyEquals(new Vec2d(3, 4).exponentiate(2), new Vec2d(15, 20));
  });
  it("should multiply vector values symmetrically", () => {
    vectorRoughlyEquals(
      new Vec2d(2, 3).multiplySymmetric({ x: 2, y: 4 }),
      new Vec2d(4, 12)
    );
  });
  it("should multiply vector values asymmetrically", () => {
    vectorRoughlyEquals(
      new Vec2d(2, 3).multiplyAsymmetric({ x: 2, y: 4 }),
      new Vec2d(8, 6)
    );
  });
  it("should multiply values of the vector correctly", () => {
    vectorRoughlyEquals(new Vec2d(5, 3).multiplyValues(2), new Vec2d(10, 6));
  });
  it("should divide values of vectors correctly", () => {
    vectorRoughlyEquals(new Vec2d(5, 3).divideValues(2), new Vec2d(2.5, 1.5));
  });
  it("should lerp between two vectors", () => {
    vectorRoughlyEquals(
      new Vec2d(200, 100).lerp({ x: 400, y: 600 }, 0.5),
      new Vec2d(300, 350)
    );
  });
});
