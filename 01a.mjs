// Correct answer: 1288

import fs from 'fs';

try {
  const answer = fs
    .readFileSync('inputs/01.txt', 'utf8')
    .split('\n')
    .reduce((acc, depth, index, array) =>
      acc + (+depth > +array[index - 1])
    , 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
