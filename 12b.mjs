// Correct answer: 136767

import fs from 'fs';

const START = 'start';
const END = 'end';
const SMALL_MAX_VISITS = 1;
const SPECIAL_MAX_VISITS = 2;

const initVertex = (graph, vertex) => {
  if (graph[vertex]) return;

  graph[vertex] = {
    isStart: vertex === START,
    isEnd: vertex === END,
    isSmall: /[a-z]/.test(vertex),
    adjacents: [],
  };
};

const countPaths = (graph, vertex, visits = {}, hasSpecial = false) => {
  const { isStart, isEnd, isSmall, adjacents } = graph[vertex];

  if (isEnd) return 1;
  if (isStart && visits.start) return 0;
  if (isSmall && hasSpecial && visits[vertex] >= SMALL_MAX_VISITS) return 0;

  visits[vertex] = visits[vertex] || 0;
  visits[vertex] += 1;

  const isSpecial = isSmall && visits[vertex] === SPECIAL_MAX_VISITS;

  return adjacents
    .filter(({ isStart }) => !isStart)
    .reduce((acc, avertex, index) =>
      acc += countPaths(graph, avertex, { ...visits }, hasSpecial || isSpecial)
    , 0);
};

try {
  const graph = fs
    .readFileSync('inputs/12.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .reduce((acc, row) => {
      const [from, to] = row.split('-');

      initVertex(acc, from);
      initVertex(acc, to);

      acc[from].adjacents.push(to);
      acc[to].adjacents.push(from);

      return acc;
    }, {});

  const answer = countPaths(graph, START);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
