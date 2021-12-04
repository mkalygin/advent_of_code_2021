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
    const boardRow = new Map(
      row
        .trim()
        .split(/\s+/)
        .map(num => [+num, false])
    );

    acc[boardIndex] = acc[boardIndex] ?? {
      rows: [],
      rowMatches: new Array(BOARD_ROWS).fill(0),
      colMatches: new Array(BOARD_COLS).fill(0),
    };

    acc[boardIndex].rows.push(boardRow);

    return acc;
  }, []);

  const winners = draws.reduce((acc, draw) => {
    boards.forEach((board, boardIndex) => {
      if (acc.get(boardIndex)) return;

      board.rows.forEach((row, rowIndex) => {
        if (!row.has(draw) || row.get(draw)) return;

        const colIndex = [...row.keys()].indexOf(draw);
        const rowMatches = board.rowMatches[rowIndex] += 1;
        const colMatches = board.colMatches[colIndex] += 1;

        row.set(draw, true);

        if (rowMatches !== BOARD_ROWS && colMatches !== BOARD_COLS) return;

        acc.set(boardIndex, { draw, board });
      });
    });

    return acc;
  }, new Map());

  const winner = [...winners.values()].pop();
  const answer = winner.draw * winner.board.rows.reduce((acc, row) => (
    acc + [...row.entries()]
      .reduce((sum, [num, isMarked]) => !isMarked ? num + sum : sum, 0)
  ), 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
