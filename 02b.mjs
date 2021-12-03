// Correct answer: 1857958050

import fs from 'fs';

try {
  const answer = fs
    .readFileSync('inputs/02.txt', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
      const [command, value] = line.split(' ');

      if (command === 'forward') {
        acc.horizontal += +value;
        acc.depth += acc.aim * value;
      } else if (command === 'up') {
        acc.aim -= +value;
      } else if (command === 'down') {
        acc.aim += +value;
      }

      return acc;
    }, { horizontal: 0, depth: 0, aim: 0 });

  console.log(answer.horizontal * answer.depth);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
