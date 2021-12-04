// Correct answer: 2568

import fs from 'fs';

const BOARD_ROWS = 5;
const BOARD_COLS = 5;

try {
  const data = fs
    .readFileSync('inputs/04.txt', 'utf8')
    .split('\n')
    .filter(Boolean);

  const draws = data
    .shift()
    .split(',')
    .map(draw => +draw);

  const boards = data.reduce((acc, row, index) => {
    const boardIndex = Math.floor(index / BOARD_ROWS);
    const rowIndex = index % BOARD_ROWS;
    const board = acc[boardIndex] = acc[boardIndex] ?? {
      numbers: new Map(),
      rowMatches: new Array(BOARD_ROWS).fill(0),
      colMatches: new Array(BOARD_COLS).fill(0),
    };

    row
      .trim()
      .split(/\s+/)
      .map((num, colIndex) => board.numbers.set(+num, [rowIndex, colIndex]));

    return acc;
  }, []);

  const winners = draws.reduce((acc, draw) => {
    boards.forEach((board, boardIndex) => {
      if (acc.get(boardIndex) || !board.numbers.has(draw) || !board.numbers.get(draw)) return;

      const [rowIndex, colIndex] = board.numbers.get(draw);
      const rowMatches = board.rowMatches[rowIndex] += 1;
      const colMatches = board.colMatches[colIndex] += 1;

      board.numbers.set(draw, null);

      if (rowMatches !== BOARD_ROWS && colMatches !== BOARD_COLS) return;

      acc.set(boardIndex, { draw, board });
    });

    return acc;
  }, new Map());

  const winner = [...winners.values()].pop();
  const answer = winner.draw * [...winner.board.numbers.entries()]
    .reduce((acc, [num, isNotMarked]) => isNotMarked ? num + acc : acc, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
