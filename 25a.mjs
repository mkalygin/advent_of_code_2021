// Correct answer: 563

import fs from 'fs';

try {
  const data = fs
    .readFileSync('inputs/25.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split(''));

  const ilen = data.length;
  const jlen = data[0].length;

  let step = 0;
  let moved;
  let locked;
  let changes;

  do {
    changes = 0;
    moved = new Set();
    locked = new Set();

    for (let i = 0; i < ilen; ++i) {
      for (let j = 0; j < jlen; ++j) {
        const k = (j + 1) % jlen;

        if (moved.has(`${i},${j}`) || locked.has(`${i},${k}`)) continue;
        if (data[i][j] !== '>' || data[i][k] !== '.') continue;

        data[i][j] = '.';
        data[i][k] = '>';

        moved.add(`${i},${k}`);
        locked.add(`${i},${j}`);
      }
    }

    changes += moved.size;
    moved = new Set();
    locked = new Set();

    for (let i = 0; i < ilen; ++i) {
      for (let j = 0; j < jlen; ++j) {
        const k = (i + 1) % ilen;

        if (moved.has(`${i},${j}`) || locked.has(`${k},${j}`)) continue;
        if (data[i][j] !== 'v' || data[k][j] !== '.') continue;

        data[i][j] = '.';
        data[k][j] = 'v';

        moved.add(`${k},${j}`);
        locked.add(`${i},${j}`);
      }
    }

    changes += moved.size;
    step++;

    // console.log(step, '========================');
    // for (let i = 0; i < ilen; ++i) {
    //   console.log(data[i].join(''));
    // }
  } while (changes > 0);

  const answer = step;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
