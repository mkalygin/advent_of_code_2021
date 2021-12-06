// Correct answer: 358214

import fs from 'fs';

const DAYS = 80;
const FISH_CYCLE = 6;
const CHILD_FISH_CYCLE = FISH_CYCLE + 2;

try {
  let fishes = fs
    .readFileSync('inputs/06.txt', 'utf8')
    .split(',')
    .map(fish => +fish);

  const answer = Array.from({ length: DAYS }).reduce((acc, _, day) => {
    const children = [];

    fishes = fishes.map(fish => {
      if (fish === 0) children.push(CHILD_FISH_CYCLE);

      return fish === 0 ? FISH_CYCLE : fish - 1;
    }).concat(children);

    return fishes.length;
  }, fishes.length);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
