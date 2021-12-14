// Correct answer: 2602

import fs from 'fs';

const STEPS = 40;

try {
  const data = fs
    .readFileSync('inputs/14.txt', 'utf8')
    .split('\n')
    .filter(Boolean);

  let template = data.shift();

  const rules = data.reduce((acc, row) => {
    const [pair, insert] = row.split(' -> ');
    acc[pair] = insert;
    return acc;
  }, {});

  for (let step = 0; step < STEPS; ++step) {
    const length = template.length + 1;

    for (let index = 0; !!template[index + 1]; ++index) {
      const pair = template.substring(index, index + 2);
      const insert = rules[pair];

      if (insert) {
        template = template.substring(0, index + 1) + insert + template.substring(index + 1);
        index++;
      }
    }
  }

  const counts = template
    .split('')
    .reduce((acc, elem) => {
      acc[elem] = acc[elem] || 0;
      acc[elem]++;
      return acc;
    }, {});

  const { min, max } = Object
    .keys(counts)
    .reduce(({ min, max }, elem) => ({
      min: counts[elem] < min ? counts[elem] : min,
      max: counts[elem] > max ? counts[elem] : max,
    }), { min: Number.MAX_VALUE, max: Number.MIN_VALUE });

  const answer = max - min;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
