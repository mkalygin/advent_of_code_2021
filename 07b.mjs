// Correct answer: 99540554

import fs from 'fs';

const fuel = (from, to) => {
  const diff = Math.abs(from - to);
  return diff * (diff + 1) / 2;
};

const metric = (crabs, to) =>
  crabs.reduce((acc, from) => acc + fuel(from, to), 0);

try {
  const crabs = fs
    .readFileSync('inputs/07.txt', 'utf8')
    .split(',')
    .map(crab => +crab);

  let min = Math.min.apply(null, crabs);
  let max = Math.max.apply(null, crabs);

  while (min !== max) {
    const mid = Math.floor((min + max) / 2);
    const left = metric(crabs, Math.floor((min + mid) / 2));
    const right = metric(crabs, Math.floor((mid + max) / 2));

    if (left <= right) {
      max = mid;
    } else {
      min = mid + 1;
    }
  }

  const answer = metric(crabs, min);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
