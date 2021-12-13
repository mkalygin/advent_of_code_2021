// Correct answer: BCZRCEAB

import fs from 'fs';

try {
  const [dotsData, foldsData] = fs
    .readFileSync('inputs/13.txt', 'utf8')
    .split('\n\n');

  const dots = dotsData
    .split('\n')
    .filter(Boolean)
    .reduce((acc, row) => {
      const [x, y] = row.split(',');
      acc[row] = { x: +x, y: +y }
      return acc;
    }, {});

  const folds = foldsData
    .split('\n')
    .filter(Boolean)
    .map(row => {
      const [_, dim, value] = row.match(/([xy])=(\d+)/);
      return { dim, value: +value };
    });

  folds.forEach(({ dim, value }) => {
    Object
      .keys(dots)
      .filter(key => dots[key][dim] > value)
      .forEach(key => {
        const { x, y } = dots[key];
        const fx = dim === 'x' ? Math.abs(x - 2 * value) : x;
        const fy = dim === 'y' ? Math.abs(y - 2 * value) : y;

        delete dots[key];

        dots[`${fx},${fy}`] = { x: fx, y: fy };
      });
  });

  let answer = '';
  const values = Object.values(dots);
  const xs = values.map(({ x }) => x);
  const ys = values.map(({ y }) => y);

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  for (let y = yMin; y <= yMax; ++y) {
    for (let x = xMin; x <= xMax; ++x) {
      const key = `${x},${y}`;
      answer += dots[key] ? '#' : '.';
    }
    answer += '\n';
  }

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
