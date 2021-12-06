// Correct answer: 18674

import fs from 'fs';

const range = ({ x1, y1, x2, y2, v, h }) => {
  const xs = x1 <= x2 ? 1 : -1;
  const ys = y1 <= y2 ? 1 : -1;
  const length = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) + 1;

  return Array.from({ length }, (_, i) => [
    v ? x1 : x1 + xs * i,
    h ? y1 : y1 + ys * i,
  ]);
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
    });

  const hits = lines.reduce((acc, line) => {
    range(line).forEach(([x, y]) => countHit(acc, x, y));

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
