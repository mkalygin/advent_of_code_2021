// Correct answer: 5259 and 15287

import fs from 'fs';

// Use 2 for part 1, and 50 for part 2.
const STEPS = 50;

const withBounds = (data, size = 1) => {
  const jlen = data[0].length;

  for (let i = 0; i < size; ++i) {
    data.unshift(Array.from({ length: jlen }).fill(0));
    data.push(Array.from({ length: jlen }).fill(0));
  }

  data.forEach(row => {
    for (let i = 0; i < size; ++i) {
      row.unshift(0);
      row.push(0);
    }
  });

  return data;
};

const filterImage = (data, algo) => {
  const ilen = data.length;
  const jlen = data[0].length;
  const result = [];
  const d = data[0][0];

  for (let i = 0; i < ilen; ++i) {
    for (let j = 0; j < jlen; ++j) {
      const bits = [
        data[i - 1]?.[j - 1] ?? d,
        data[i - 1]?.[j] ?? d,
        data[i - 1]?.[j + 1] ?? d,
        data[i]?.[j - 1] ?? d,
        data[i]?.[j] ?? d,
        data[i]?.[j + 1] ?? d,
        data[i + 1]?.[j - 1] ?? d,
        data[i + 1]?.[j] ?? d,
        data[i + 1]?.[j + 1] ?? d
      ];

      const index = parseInt(bits.join(''), 2);

      result[i] = result[i] ?? [];
      result[i][j] = algo[index];
    }
  }

  return result;
};

const printImage = data => {
  data.forEach(row => {
    console.log(row.map(bit => bit === 1 ? '#' : '.').join(''));
  });
};

try {
  const data = fs
    .readFileSync('inputs/20.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(char => char === '#' ? 1 : 0));

  const algo = data.shift();
  let xdata = withBounds(data, STEPS);

  for (let step = 0; step < STEPS; ++step) {
    xdata = filterImage(xdata, algo);
  }

  const answer = xdata.reduce((acc, row) =>
    acc + row.reduce((sum, bit) => sum + bit, 0)
  , 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
