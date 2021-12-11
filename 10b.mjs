// Correct answer: 2380061249

import fs from 'fs';

const MATCHES = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const SCORES = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const OPENS = Object.keys(MATCHES);
const CLOSES = Object.values(MATCHES);

try {
  const lines = fs
    .readFileSync('inputs/10.txt', 'utf8')
    .split('\n')
    .filter(Boolean);

  const scores = lines.map(line => {
    const chars = line.split('');
    const stack = [];

    while (chars.length > 0) {
      const char = chars.shift();
      const expected = MATCHES[stack[0]];

      if (OPENS.includes(char)) {
        stack.unshift(char);
      } else if (char === expected) {
        stack.shift();
      } else {
        return null;
      }
    }

    return stack.reduce((score, char) => score * 5 + SCORES[MATCHES[char]], 0);
  }).filter(Boolean);

  const answer = scores
    .sort((a, b) => b - a)
    [Math.floor(scores.length / 2)];

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
