export function lerp(low: number, high: number, value: number) {
  return low * (1 - value) + high * value;
}

export function clamp(value: number, low = 0, high = 1) {
  return value > high ? high : value < low ? low : value;
}
