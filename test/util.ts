import { CurveBase2d } from "src/curve-base2d";
import { Vec2d } from "src/vec2d";

export function vectorRoughlyEquals(v1: Vec2d, v2: Vec2d, numDigits = 6) {
  expect(v1.distance(v2)).toBeCloseTo(0, numDigits);
}

export function vectorsRoughlyEqual(
  actual: Vec2d[],
  expected: Vec2d[],
  numDigits?: number
) {
  expect(actual.length).toEqual(expected.length);
  for (let i = 0; i < actual.length; ++i)
    vectorRoughlyEquals(actual[i], expected[i], numDigits);
}

export function curveRoughlyEquals(
  curve: CurveBase2d,
  expected: CurveBase2d,
  expectedRange: [number, number] = [0, 1],
  numDigits = 5
) {
  const [start, end] = expectedRange;
  const delta = end - start;
  for (const i of range(0, 1, 0.1))
    vectorRoughlyEquals(
      curve.getByPercent(i, 1000),
      expected.getByPercent(start + delta * i),
      numDigits
    );
}

export function* range(start: number, end?: number, step?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  if (step === undefined) step = end > start ? 1 : -1;
  if (start <= end) for (let i = start; i < end; i += step) yield i;
  else for (let i = start; i > end; i += step) yield i;
}
