export default function formatDigits(x: number): number {
  return Math.round(x * 100) / 100;
}