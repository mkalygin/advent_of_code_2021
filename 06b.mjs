// Correct answer: 1622533344325

import fs from 'fs';

const DAYS = 256;
const FISH_CYCLE = 6;
const CHILD_FISH_CYCLE = FISH_CYCLE + 2;

try {
  const counts = new Array(CHILD_FISH_CYCLE + 1).fill(0);

  fs
    .readFileSync('inputs/06.txt', 'utf8')
    .split(',')
    .forEach(fish => counts[+fish] += 1);

  for (let day = 0; day < DAYS; ++day) {
    const children = counts[0];

    for (let period = 1; period < counts.length; ++period) {
      counts[period - 1] = counts[period];
    }

    counts[CHILD_FISH_CYCLE] = children;
    counts[FISH_CYCLE] += children;
  }

  const answer = counts.reduce((acc, count) => acc + count, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
