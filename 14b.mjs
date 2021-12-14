// Correct answer: 2188189693529

import fs from 'fs';

const STEPS = 40;

const incByKey = (obj, key, value) => {
  obj[key] = obj[key] ?? 0;
  obj[key] += value;
};

try {
  const data = fs
    .readFileSync('inputs/14.txt', 'utf8')
    .split('\n')
    .filter(Boolean);

  const template = data.shift();
  const rules = data.reduce((acc, row) => {
    const [pair, insert] = row.split(' -> ');
    acc[pair] = insert;
    return acc;
  }, {});

  let counts = {};

  for (let index = 0; index < template.length - 1; ++index) {
    const pair = template.substring(index, index + 2);
    incByKey(counts, pair, 1);
  }

  for (let step = 0; step < STEPS; ++step) {
    const mutation = Object
      .keys(counts)
      .reduce((acc, pair) => {
        const insert = rules[pair];
        const count = counts[pair];

        if (insert) {
          const [left, right] = pair.split('');
          const lpair = `${left}${insert}`;
          const rpair = `${insert}${right}`;

          incByKey(acc, pair, -count);
          incByKey(acc, lpair, count);
          incByKey(acc, rpair, count);
        }

        return acc;
      }, {});

    Object
      .keys(mutation)
      .forEach(pair => incByKey(counts, pair, mutation[pair]));
  }

  const elemCounts = Object
    .keys(counts)
    .reduce((acc, pair) => {
      const count = counts[pair];
      const [left, right] = pair.split('');

      incByKey(acc, left, count);
      incByKey(acc, right, count);

      return acc;
    }, {});

  // First and last elements must be count twice too.
  elemCounts[template[0]]++;
  elemCounts[template[template.length - 1]]++;

  const { min, max } = Object
    .keys(elemCounts)
    .reduce(({ min, max }, elem) => ({
      min: elemCounts[elem] < min ? elemCounts[elem] : min,
      max: elemCounts[elem] > max ? elemCounts[elem] : max,
    }), { min: Number.MAX_VALUE, max: Number.MIN_VALUE });

  const answer = (max - min) / 2;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
