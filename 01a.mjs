// 1288

import fs from 'fs';
import fetch from 'node-fetch';

try {
  const answer = fs
    .readFileSync('inputs/01.txt', 'utf8')
    .split('\n')
    .reduce((acc, depth, index, array) =>
      acc + (index > 0 && +depth > +array[index - 1])
    , 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
