// Correct answer: 1004688

import fs from 'fs';

const sort = p => p.split('').sort().join('');
const subtract = (p1, p2) => p1.replace(new RegExp(`[${p2}]`, 'gi'), '');

const finders = {
  1: ps => ps.find(p => p.length === 2),
  4: ps => ps.find(p => p.length === 4),
  7: ps => ps.find(p => p.length === 3),
  8: ps => ps.find(p => p.length === 7),

  9: (ps, four) => ps.find(p => p.length === 6 && subtract(p, four).length === 2),
  6: (ps, one) => ps.find(p => p.length === 6 && subtract(p, one).length === 5),
  0: (ps, six, nine) => ps.find(p => p.length === 6 && p !== six && p !== nine),

  3: (ps, seven) => ps.find(p => p.length === 5 && subtract(p, seven).length === 2),
  5: (ps, six) => ps.find(p => p.length === 5 && subtract(six, p).length === 1),
  2: (ps, three, five) => ps.find(p => p.length === 5 && p !== three && p !== five),
};

try {
  const data = fs
    .readFileSync('inputs/08.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => {
      const [left, right] = row.split('|');

      return {
        patterns: left.trim().split(/\s+/).map(sort),
        values: right.trim().split(/\s+/).map(sort),
      };
    });

  const answer = data.reduce((acc, { patterns, values }) => {
    const numbers = {};
    const mapping = {};

    mapping[numbers[1] = finders[1](patterns)] = 1;
    mapping[numbers[4] = finders[4](patterns)] = 4;
    mapping[numbers[7] = finders[7](patterns)] = 7;
    mapping[numbers[8] = finders[8](patterns)] = 8;

    mapping[numbers[9] = finders[9](patterns, numbers[4])] = 9;
    mapping[numbers[6] = finders[6](patterns, numbers[1])] = 6;
    mapping[numbers[0] = finders[0](patterns, numbers[6], numbers[9])] = 0;

    mapping[numbers[3] = finders[3](patterns, numbers[7])] = 3;
    mapping[numbers[5] = finders[5](patterns, numbers[6])] = 5;
    mapping[numbers[2] = finders[2](patterns, numbers[3], numbers[5])] = 2;

    const output = parseInt(values.map(value => mapping[value]).join(''));

    return acc + output;
  }, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
