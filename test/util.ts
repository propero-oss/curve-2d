import { Vec2d } from "src/vec2d";

export function vectorRoughlyEquals(v1: Vec2d, v2: Vec2d) {
  expect(v1.x).toBeCloseTo(v2.x, 6);
  expect(v1.y).toBeCloseTo(v2.y, 6);
}
