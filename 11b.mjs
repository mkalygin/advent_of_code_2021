// Correct answer: 368

import fs from 'fs';

const MAX_ENERGY = 9;

const countFlashes = (grid, i, j, flashes) => {
  const key = `${i},${j}`;

  if (!Number.isInteger(grid?.[i]?.[j]) || flashes.has(key)) return;

  grid[i][j] += 1;

  if (grid[i][j] > MAX_ENERGY) {
    flashes.add(key);

    grid[i][j] = 0;

    countFlashes(grid, i - 1, j - 1, flashes);
    countFlashes(grid, i - 1, j, flashes);
    countFlashes(grid, i - 1, j + 1, flashes);
    countFlashes(grid, i, j - 1, flashes);
    countFlashes(grid, i, j + 1, flashes);
    countFlashes(grid, i + 1, j - 1, flashes);
    countFlashes(grid, i + 1, j, flashes);
    countFlashes(grid, i + 1, j + 1, flashes);
  }
};

try {
  const grid = fs
    .readFileSync('inputs/11.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(energy => +energy));

  const size = grid.length * grid[0].length;

  let step = 0;
  let flashes = new Set();

  while (flashes.size !== size) {
    flashes = new Set();

    for (let i = 0; i < grid.length; ++i) {
      for (let j = 0; j < grid[i].length; ++j) {
        countFlashes(grid, i, j, flashes);
      }
    }

    step++;
  }

  const answer = step;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
