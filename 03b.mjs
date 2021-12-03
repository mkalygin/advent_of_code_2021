// Correct answer: 5941884

import fs from 'fs';

const BITS_LENGTH = 12;

const filterByBitCriteria = (data, comparator, bitIndex = 0) => {
  if (data.length <= 1 || bitIndex === BITS_LENGTH) return parseInt(data[0]?.join(''), 2);

  const bitSum = data.reduce((acc, bits) => acc + bits[bitIndex], 0)
  const commonBit = comparator(bitSum, data.length / 2) ? 1 : 0;
  const newData = data.filter(bits => bits[bitIndex] === commonBit);

  return filterByBitCriteria(newData, comparator, bitIndex + 1);
};

try {
  const data = fs
    .readFileSync('inputs/03.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => row.split('').map(bit => +bit));

  const oxygen = filterByBitCriteria(data, (bitSum, threshold) => bitSum >= threshold);
  const co2 = filterByBitCriteria(data, (bitSum, threshold) => bitSum < threshold);
  const answer = oxygen * co2;

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
