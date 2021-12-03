// Correct answer: 4006064

import fs from 'fs';

const BITS_LENGTH = 12;

try {
  const data = fs
    .readFileSync('inputs/03.txt', 'utf8')
    .split('\n')
    .map(row => row.split('').map(bit => +bit));

  const bitSums = data.reduce((acc, bits) => {
    bits.forEach((bit, index) => acc[index] += bit);

    return acc;
  }, new Array(BITS_LENGTH).fill(0));

  const threshold = data.length / 2;
  const gammaBits = bitSums.map(bitSum => bitSum >= threshold ? 1 : 0).join('');
  const epsilonBits = bitSums.map(bitSum => bitSum < threshold ? 1 : 0).join('');
  const gamma = parseInt(gammaBits, 2);
  const epsilon = parseInt(epsilonBits, 2);
  const answer = gamma * epsilon;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
