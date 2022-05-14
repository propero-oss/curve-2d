export function lerp(low: number, high: number, value: number) {
  return low * (1 - value) + high * value;
}

export function clamp(value: number, low = 0, high = 1) {
  return value > high ? high : value < low ? low : value;
}

export function clampModulo(value: number, lower: number, higher: number) {
  const delta = higher - lower;
  value = (value - lower) % delta;
  if (value < 0) value += delta;
  return lower + value;
}

const taw = Math.PI * 2;
export function clampAngle(angle: number): number {
  return clampModulo(angle, 0, taw);
}

export function angleBetween(
  angle: number,
  start: number,
  end: number,
  counterClockwise = false
) {
  angle = clampAngle(angle);
  start = clampAngle(start);
  end = clampAngle(end);

  if (end < start) start = start - taw;
  if (end < angle) angle = angle - taw;

  return angle >= start && angle < end ? !counterClockwise : counterClockwise;
}
