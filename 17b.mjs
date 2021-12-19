// Correct answer: 5644

import fs from 'fs';

const range = (a, b) => {
  const sign = a <= b ? 1 : -1;
  const length = Math.abs(b - a) + 1;

  return Array.from({ length }, (_, i) => a + sign * i);
};

try {
  const [, xmin, xmax, ymin, ymax] = fs
    .readFileSync('inputs/17.txt', 'utf8')
    .trim()
    .match(/x=(-?\d+)\.\.(-?\d+),\sy=(-?\d+)\.\.(-?\d+)/)
    .map(value => +value);

  const vs = new Set();
  const xs = range(xmin, xmax);
  const ys = range(ymin, ymax);

  ys.forEach(y => {
    const steps = 2 * Math.abs(y + 1) + 2;

    xs.forEach(x => {
      const nxmax = (Math.sqrt(1 + 8 * x) - 1) / 2;

      for (let step = 1; step <= steps; ++step) {
        const nx = Math.min(nxmax, step);
        const ny = step;

        const vx = x / nx + (nx - 1) / 2;
        const vy = y / ny + (ny - 1) / 2;

        if (Number.isInteger(vx) && Number.isInteger(vy)) {
          vs.add(`${vx},${vy}`);
        }
      }
    });
  });

  const answer = vs.size;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
