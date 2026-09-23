export const DEFAULT_RAIN_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

export function seededRainNoise(x: number, y: number) {
  let value = x * 127 + y * 311;
  value = (value >> 13) ^ value;

  return (
    ((value * (value * value * 15731 + 789221) + 1376312589) & 2147483647) /
    2147483647
  );
}

type RainFrameOptions = {
  columns: number;
  rows: number;
  time: number;
  chars?: string;
  density?: number;
  speed?: number;
  tailLength?: number;
};

export type RainCell = {
  alpha: number;
  character: string;
  column: number;
  isHead: boolean;
  row: number;
};

export function createRainFrame({
  columns,
  rows,
  time,
  chars = DEFAULT_RAIN_CHARACTERS,
  density = 1,
  speed = 0.6,
  tailLength = 20,
}: RainFrameOptions): RainCell[] {
  const cells: RainCell[] = [];
  const cycle = rows + tailLength;

  for (let column = 0; column < columns; column += 1) {
    if (seededRainNoise(column * 17, 3) > density) continue;

    const columnSpeed =
      (0.5 + seededRainNoise(column * 31, 7) * 1.5) * speed;
    const offset = seededRainNoise(column * 13, 11) * cycle;
    const head = Math.floor((time * columnSpeed * 7 + offset) % cycle);

    for (let tailIndex = 0; tailIndex <= tailLength; tailIndex += 1) {
      const row = head - (tailLength - tailIndex);

      if (row < 0 || row >= rows) continue;

      const characterValue = seededRainNoise(
        column * 53 + Math.floor(time * 5 + tailIndex),
        row * 7,
      );

      const isHead = tailIndex === tailLength;
      const tailProgress = tailIndex / tailLength;

      cells.push({
        alpha: isHead ? 1 : Math.pow(tailProgress, 1.8) * 0.62,
        character: chars[Math.floor(characterValue * chars.length)] ?? " ",
        column,
        isHead,
        row,
      });
    }
  }

  return cells;
}
