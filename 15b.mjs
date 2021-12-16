// Correct answer: 2838

import fs from 'fs';

const X_TILES = 5;
const Y_TILES = 5;
const MAX_RISK = 9;

const vkey = (i, j) => `${i},${j}`;

const expandGrid = (grid, ytiles, xtiles) => {
  const ilen = grid.length;
  const jlen = grid[0].length;

  const xgrid = Array
    .from({ length: ytiles })
    .map(() =>
      Array
        .from({ length: ilen })
        .map((_, i) =>
          Array.from({ length: xtiles }).fill(grid[i]).flat()
        )
    )
    .flat();

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

const minDistanceKey = (notVisited, distances) => {
  const keys = [...notVisited];

  const [imin, jmin] = keys.reduce(([imin, jmin], key) => {
    const [i, j] = key.split(',');
    const mkey = vkey(imin, jmin);
    const min = distances[mkey] ?? Number.MAX_VALUE;

    return distances[key] < min ? [+i, +j] : [imin, jmin];
  }, [-1, -1]);

  return [imin, jmin];
};

const findRiskLevels = (grid, si, sj, ei, ej) => {
  const skey = vkey(si, sj);
  const notVisited = new Set([skey]);
  const visited = new Set();
  const distances = { [skey]: 0 };
  const gsize = grid.length * grid[0].length;

  while (visited.size < gsize) {
    const [imin, jmin] = minDistanceKey(notVisited, distances);

    if (imin === ei && jmin === ej) break;

    const mkey = vkey(imin, jmin);
    const distance = distances[mkey];
    const adjacents = [
      { i: imin - 1, j: jmin,     key: vkey(imin - 1, jmin) },
      { i: imin + 1, j: jmin,     key: vkey(imin + 1, jmin) },
      { i: imin,     j: jmin - 1, key: vkey(imin,     jmin - 1) },
      { i: imin,     j: jmin + 1, key: vkey(imin,     jmin + 1) },
    ].filter(({ i, j, key }) =>
      Number.isInteger(grid[i]?.[j]) && !visited.has(key)
    );

    notVisited.delete(mkey);
    visited.add(mkey);

    adjacents.forEach(({ i, j, key }) => {
      const adistance = distance + grid[i][j];

      distances[key] = distances[key] ?? Number.MAX_VALUE;
      if (adistance < distances[key]) distances[key] = adistance;

      notVisited.add(key);
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
  const answer = risks[vkey(ei, ej)];

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
