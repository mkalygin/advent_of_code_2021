// Correct answer: 1693300

import fs from 'fs';

try {
  const answer = fs
    .readFileSync('inputs/02.txt', 'utf8')
    .split('\n')
    .slice(0, -1)
    .reduce((acc, line) => {
      const [command, value] = line.split(' ');

      if (command === 'forward') {
        acc.horizontal += +value;
      } else if (command === 'up') {
        acc.depth -= +value;
      } else if (command === 'down') {
        acc.depth += +value;
      }

      return acc;
    }, { horizontal: 0, depth: 0 });

  console.log(answer.horizontal * answer.depth);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
