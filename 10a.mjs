// Correct answer: 394647

import fs from 'fs';

const MATCHES = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const SCORES = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const OPENS = Object.keys(MATCHES);
const CLOSES = Object.values(MATCHES);

try {
  const lines = fs
    .readFileSync('inputs/10.txt', 'utf8')
    .split('\n')
    .filter(Boolean);

  const answer = lines.reduce((acc, line) => {
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
        return acc + SCORES[char];
      }
    }

    return acc;
  }, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
