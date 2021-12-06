// Correct answer: 4421

import fs from 'fs';

const range = (a, b) => {
  const sign = a <= b ? 1 : -1;
  const length = Math.abs(b - a) + 1;

  return Array.from({ length }, (_, i) => a + sign * i);
};

const countHit = (acc, x, y) => {
  const key = `${x},${y}`;

  acc[key] = acc[key] ?? 0;
  acc[key] += 1;
};

try {
  const lines = fs
    .readFileSync('inputs/05.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => {
      const [start, end] = row.split(' -> ');
      const [x1, y1] = start.split(',').map(x => +x);
      const [x2, y2] = end.split(',').map(y => +y);
      const h = y1 === y2;
      const v = x1 === x2;

      return { x1, y1, x2, y2, h, v };
    })
    .filter(({ h, v }) => h || v);

  const hits = lines.reduce((acc, line) => {
    if (line.h) {
      range(line.x1, line.x2).forEach(x => countHit(acc, x, line.y1));
    }

    if (line.v) {
      range(line.y1, line.y2).forEach(y => countHit(acc, line.x1, y));
    }

    return acc;
  }, {});

  const answer = Object
    .values(hits)
    .filter(count => count > 1)
    .length;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
