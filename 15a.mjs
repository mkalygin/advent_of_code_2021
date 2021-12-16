// Correct answer: 361

import fs from 'fs';

const vkey = (i, j) => `${i},${j}`;

const minDistanceKey = (grid, visited, distances) => {
  let imin;
  let jmin;

  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      const mkey = vkey(imin, jmin);
      const key = vkey(i, j);
      const min = distances[mkey] ?? Number.MAX_VALUE;

      if (visited.has(key)) continue;
      if (distances[key] < min) {
        imin = i;
        jmin = j;
      }
    }
  }

  return [imin, jmin];
};

const findRiskLevels = (grid, i0, j0) => {
  const visited = new Set();
  const distances = { [vkey(i0, j0)]: 0 };
  const gsize = grid.length * grid[0].length;

  while (visited.size < gsize) {
    const [imin, jmin] = minDistanceKey(grid, visited, distances);
    const mkey = vkey(imin, jmin);
    const distance = distances[mkey];
    const adjacents = [
      [imin - 1, jmin],
      [imin + 1, jmin],
      [imin, jmin - 1],
      [imin, jmin + 1],
    ];

    visited.add(mkey);

    adjacents.forEach(([i, j]) => {
      const akey = vkey(i, j);

      if (!Number.isInteger(grid[i]?.[j]) || visited.has(akey)) return;

      const adistance = distance + grid[i][j];
      distances[akey] = distances[akey] ?? Number.MAX_VALUE;

      if (adistance < distances[akey]) distances[akey] = adistance;
    });
  }

  return distances;
};

try {
  const grid = fs
    .readFileSync('inputs/15.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(risk => +risk));

  const risks = findRiskLevels(grid, 0, 0);
  const ei = grid.length - 1;
  const ej = grid[0].length - 1;
  const answer = risks[vkey(ei, ej)];

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
