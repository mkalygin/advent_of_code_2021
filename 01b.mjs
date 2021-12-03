// Correct answer: 1311

import fs from 'fs';

try {
  const answer = fs
    .readFileSync('inputs/01.txt', 'utf8')
    .split('\n')
    .reduce((acc, _, index, array) =>
      acc + (index < array.length - 3 && +array[index + 2] > +array[index - 1])
    , 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
