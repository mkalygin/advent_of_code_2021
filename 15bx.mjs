// Correct answer: 2838

import fs from 'fs';

const X_TILES = 5;
const Y_TILES = 5;
const MAX_RISK = 9;

const expandGrid = (grid, ytiles, xtiles) => {
  const ilen = grid.length;
  const jlen = grid[0].length;

  const xgrid = Array.from({ length: ytiles }, () =>
    Array.from({ length: ilen }, (_, i) =>
      Array.from({ length: xtiles }).fill(grid[i]).flat()
    )
  ).flat();

  for (let y = 0; y < ytiles; ++y) {
    for (let x = 0; x < xtiles; ++x) {
      for (let i = 0; i < ilen; ++i) {
        for (let j = 0; j < jlen; ++j) {
          const m = y * ilen + i;
          const n = x * jlen + j;

          xgrid[m][n] += x + y;
          if (xgrid[m][n] > MAX_RISK) xgrid[m][n] = xgrid[m][n] % MAX_RISK;
        }
      }
    }
  }

  return xgrid;
};

const findRiskLevels = (grid, si, sj, ei, ej) => {
  const ilen = grid.length;
  const jlen = grid[0].length;

  const notVisited = [[si, sj]];
  const distances = Array.from({ length: ilen }, () =>
    Array.from({ length: jlen }).fill(Number.MAX_VALUE)
  );

  distances[si][sj] = 0;

  while (notVisited.length > 0) {
    const [mi, mj] = notVisited.sort(([ai, aj], [bi, bj]) =>
      distances[ai][aj] - distances[bi][bj]
    ).shift();

    if (mi === ei && mj === ej) break;

    const distance = distances[mi][mj];
    const adjacents = [
      [mi - 1, mj],
      [mi + 1, mj],
      [mi,     mj - 1],
      [mi,     mj + 1],
    ].filter(([i, j]) => Number.isInteger(grid[i]?.[j]));

    adjacents.forEach(([i, j]) => {
      const adistance = distance + grid[i][j];

      if (adistance < distances[i][j]) {
        distances[i][j] = adistance;
        notVisited.push([i, j]);
      }
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

  const xgrid = expandGrid(grid, X_TILES, Y_TILES);
  const risks = findRiskLevels(xgrid, 0, 0);
  const ei = xgrid.length - 1;
  const ej = xgrid[0].length - 1;
  const answer = risks[ei][ej];

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
