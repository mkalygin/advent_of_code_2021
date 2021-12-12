// Correct answer: 4411

import fs from 'fs';

const START = 'start';
const END = 'end';

const initVertex = (graph, vertex) => {
  if (graph[vertex]) return;

  graph[vertex] = {
    isStart: vertex === START,
    isEnd: vertex === END,
    isSmall: /[a-z]/.test(vertex),
    adjacents: [],
  };
};

const countPaths = (graph, vertex, path = new Set()) => {
  const { isEnd, isSmall, adjacents } = graph[vertex];

  if (isEnd) return 1;
  if (isSmall && path.has(vertex)) return 0;

  path.add(vertex);

  return adjacents.reduce((acc, avertex) =>
    acc + countPaths(graph, avertex, new Set([...path]))
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
