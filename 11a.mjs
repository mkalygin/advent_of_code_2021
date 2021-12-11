// Correct answer: 1601

import fs from 'fs';

const STEPS = 100;
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

  let answer = 0;

  for (let step = 0; step < STEPS; ++step) {
    let flashes = new Set();

    for (let i = 0; i < grid.length; ++i) {
      for (let j = 0; j < grid[i].length; ++j) {
        countFlashes(grid, i, j, flashes);
      }
    }

    answer += flashes.size;
  }

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
