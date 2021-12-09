// Correct answer: 588

import fs from 'fs';

try {
  const grid = fs
    .readFileSync('inputs/09.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(height => +height));

  const answer = grid.reduce((acc, row, i) => {
    row.forEach((height, j) => {
      const adjacents = [
        grid[i - 1]?.[j],
        grid[i + 1]?.[j],
        grid[i]?.[j - 1],
        grid[i]?.[j + 1],
      ].filter(Number.isInteger);

      if (height < Math.min(...adjacents)) {
        acc += 1 + height;
      }
    });

    return acc;
  }, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
