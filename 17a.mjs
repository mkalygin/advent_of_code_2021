// Correct answer: 13203

import fs from 'fs';

try {
  const [,,, ymin] = fs
    .readFileSync('inputs/17.txt', 'utf8')
    .trim()
    .match(/x=(-?\d+)\.\.(-?\d+),\sy=(-?\d+)\.\.(-?\d+)/)
    .map(value => +value);

  const vy = Math.abs(ymin + 1);
  const answer = vy * (vy + 1) / 2;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
