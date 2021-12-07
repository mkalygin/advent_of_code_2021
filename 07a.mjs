// Correct answer: 349769

import fs from 'fs';

try {
  const crabs = fs
    .readFileSync('inputs/07.txt', 'utf8')
    .split(',')
    .map(crab => +crab)
    .sort((a, b) => a - b);

  let answer = 0;

  for (let i = 0, j = crabs.length - 1; i <= j; ++i, --j) {
    answer += crabs[j] - crabs[i];
  }

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
