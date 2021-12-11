// Correct answer: 964712

import fs from 'fs';

const MAX_HEIGHT = 9;

const isBasinPoint = height =>
  Number.isInteger(height) && height < MAX_HEIGHT;

const findBasinSize = (grid, i, j, points = new Set()) => {
  const height = grid[i]?.[j];
  const key = `${i},${j}`;

  if (points.has(key) || !isBasinPoint(height)) return points.size;

  points.add(key);

  findBasinSize(grid, i - 1, j, points);
  findBasinSize(grid, i + 1, j, points);
  findBasinSize(grid, i, j - 1, points);
  findBasinSize(grid, i, j + 1, points);

  return points.size;
};

try {
  const grid = fs
    .readFileSync('inputs/09.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(height => +height));

  const basins = grid.reduce((acc, row, i) => {
    row.forEach((height, j) => {
      const adjacents = [
        grid[i - 1]?.[j],
        grid[i + 1]?.[j],
        grid[i]?.[j - 1],
        grid[i]?.[j + 1],
      ].filter(Number.isInteger);

      if (height < Math.min(...adjacents)) {
        acc.push(findBasinSize(grid, i, j));
      }
    });

    return acc;
  }, []);

  const [b1, b2, b3] = basins.sort((a, b) => b - a);
  const answer = b1 * b2 * b3;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
