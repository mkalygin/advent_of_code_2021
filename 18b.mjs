// Correct answer: 4735

import fs from 'fs';
import { DLNode, DLList } from './lib/structs.mjs';

const MIN_DEPTH = 0;
const MAX_DEPTH = 4;
const EXPLODE_VALUE = 0;
const SPLIT_VALUE = 10;

const DepthChars = Object.freeze({
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  Max: 'ⁿ',
});

const Side = Object.freeze({
  None: 0,
  Left: 1,
  Right: 2,
});

class Node extends DLNode {
  constructor({ depth = 0, side = Side.None, ...attrs }) {
    super(attrs);
    this.depth = depth;
    this.side = side;
  }
}

class List extends DLList {
  createNode(attrs = {}) {
    return new Node(attrs);
  }

  reduce() {
    let exploded = 0;
    let splitted = 0;

    do {
      exploded = this.explode();
      splitted = this.split();
    } while (exploded + splitted > 0);
  }

  magnify() {
    let magnified = 0;

    do {
      magnified = this.magnifyOnce();
    } while (magnified > 0);

    this.magnitude = this.head.value;
  }

  explode() {
    let count = 0;
    let node = this.head;

    do {
      if (node.depth === MAX_DEPTH && this.isPairLeft(node)) {
        if (node.prev) node.prev.value += node.value;
        if (node.next?.next) node.next.next.value += node.next.value;

        node.value = EXPLODE_VALUE;
        node.depth -= 1;
        node.side = node.depth === node.prev?.depth && node.prev?.side === Side.Left ? Side.Right : Side.Left;
        count += 1;

        this.remove(node.next);
      } else if (this.shouldBePairRight(node)) {
        node.side = Side.Right;
      }
    } while (node = node.next);

    return count;
  }

  split() {
    let count = 0;
    let node = this.head;

    do {
      if (node.value >= SPLIT_VALUE) {
        const lvalue = Math.floor(node.value / 2);
        const rvalue = Math.ceil(node.value / 2);

        node.value = lvalue;
        node.depth += 1;
        node.side = Side.Left;

        this.insertNext(node, {
          value: rvalue,
          depth: node.depth,
          side: Side.Right,
        });

        count += 1;
        break;
      }
    } while (node = node.next);

    return count;
  }

  magnifyOnce() {
    let count = 0;
    let node = this.head;

    do {
      if (this.isPairLeft(node)) {
        node.value = node.value * 3 + node.next.value * 2;
        node.depth -= 1;
        node.side = node.depth === node.prev?.depth && node.prev?.side === Side.Left ? Side.Right : Side.Left;
        count += 1;

        this.remove(node.next);
      } else if (this.shouldBePairRight(node)) {
        node.side = Side.Right;
      }
    } while (node = node.next);

    return count;
  }

  concat(list) {
    let node;

    node = this.head;

    do {
      node.depth += 1;
    } while (node = node.next);

    node = list.head;

    do {
      node.depth += 1;
    } while (node = node.next);

    list.head.prev = this.tail;
    this.tail.next = list.head;
    this.tail = list.tail;
    this.length += list.length;
  }

  toString() {
    let output = '';
    let node = this.head;

    do {
      output += `${node.value}${DepthChars[node.depth] || DepthChars.Max}`;

      if (node.next) {
        output += this.isPairLeft(node) ? '-' : ', ';
      }
    } while (node = node.next);

    return `(${output})`;
  }

  isPairLeft(node) {
    return node.side === Side.Left && node.next?.side === Side.Right && node.depth === node.next?.depth;
  }

  shouldBePairRight(node) {
    return node.side === Side.Left && node.prev?.side === Side.Left && node.depth === node.prev?.depth;
  }
}

const parseFishNumberAsList = (value, depth = MIN_DEPTH, list = new List()) => {
  let lnode, rnode;
  const [lvalue, rvalue] = value;

  if (Number.isInteger(lvalue)) {
    lnode = list.append({ depth, value: lvalue, side: Side.Left });
  } else {
    parseFishNumberAsList(lvalue, depth + 1, list);
  }

  if (Number.isInteger(rvalue)) {
    rnode = list.append({ depth, value: rvalue, side: Side.Right });
  } else {
    parseFishNumberAsList(rvalue, depth + 1, list);
  }

  return list;
};

try {
  const rows = fs
    .readFileSync('inputs/18.txt', 'utf8')
    .trim()
    .split('\n');

  const answer = rows
    .reduce((acc, arow) => {
      rows.forEach(brow => {
        if (arow === brow) return;

        acc.push([
          parseFishNumberAsList(JSON.parse(arow)),
          parseFishNumberAsList(JSON.parse(brow)),
        ]);
      });

      return acc;
    }, [])
    .reduce((acc, [alist, blist]) => {
      const sum = alist;

      sum.concat(blist);
      sum.reduce();
      sum.magnify();

      return sum.magnitude > acc ? sum.magnitude : acc;
    }, Number.MIN_VALUE);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
