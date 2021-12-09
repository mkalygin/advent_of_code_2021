// Correct answer: 392

import fs from 'fs';

const UNIQUE_SEGMENTS_NUMBERS = [2, 3, 4, 7];

try {
  const data = fs
    .readFileSync('inputs/08.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => {
      const [left, right] = row.split('|');

      return {
        patterns: left.trim().split(/\s+/),
        values: right.trim().split(/\s+/),
      };
    });

  const answer = data.reduce((acc, { values }) =>
    acc + values.filter(value => UNIQUE_SEGMENTS_NUMBERS.includes(value.length)).length
  , 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
