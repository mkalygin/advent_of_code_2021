// Correct answer: 13203

import fs from 'fs';

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

class Node {
  constructor({ value, depth = 0, side = Side.None, next = null, prev = null }) {
    this.value = value;
    this.depth = depth;
    this.side = side;
    this.next = next;
    this.prev = prev;
  }
}

class List {
  #head;
  #tail;
  #length;
  #magnitude;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }

  get head() {
    return this.#head;
  }

  get tail() {
    return this.#tail;
  }

  get length() {
    return this.#length;
  }

  get magnitude() {
    return this.#magnitude;
  }

  append({ value, depth, side }) {
    const node = new Node({ value, depth, side });

    if (this.length === 0) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.prev = this.#tail;
      this.#tail.next = node;
      this.#tail = node;
    }

    this.#length += 1;

    return node;
  }

  prepend({ value, depth, side }) {
    const node = new Node({ value, depth, side });

    if (this.length === 0) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.next = this.#head;
      this.#head.prev = node;
      this.#head = node;
    }

    this.#length += 1;

    return node;
  }

  insertAt(index, { value, depth, side }) {
    if (!Number.isInteger(index) || index < 0 || index > this.#length) {
      throw new Error('Invalid index');
    }

    if (index === 0) return this.prepend(value);
    if (index === this.#length) return this.append(value);

    const node = new Node({ value, depth, side });
    const target = this.findAt(index);

    node.prev = target.prev;
    node.next = target;
    target.prev.next = node;
    target.prev = node;

    this.#length += 1;

    return node;
  }

  insertNext(target, { value, depth, side }) {
    const node = new Node({ value, depth, side });

    if (target === this.#tail) {
      node.prev = target;
      target.next = node;
      this.#tail = node;
    } else {
      node.prev = target;
      node.next = target.next;
      target.next.prev = node;
      target.next = node;
    }

    this.#length += 1;

    return target;
  }

  insertPrev(target, { value, depth, side }) {
    const node = new Node({ value, depth, side });

    if (target === this.#head) {
      node.next = target;
      target.prev = node;
      this.#head = node;
    } else {
      node.prev = target.prev;
      node.next = target;
      target.prev.next = node;
      target.prev = node;
    }

    this.#length += 1;

    return target;
  }

  removeAt(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.#length - 1) {
      throw new Error('Invalid index');
    }

    const target = this.findAt(index);

    return this.remove(target);
  }

  remove(target) {
    if (target === this.#head) {
      this.#head = target.next;
      this.#head.prev = null;
    } else if (target === this.#tail) {
      this.#tail = target.prev;
      this.#tail.next = null;
    } else {
      target.prev.next = target.next;
      target.next.prev = target.prev;
    }

    this.#length -= 1;

    return target;
  }

  findAt(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.#length - 1) {
      throw new Error('Invalid index');
    }

    let target = this.#head;

    for (let i = 1; i <= index; ++i) {
      target = target.next;
    }

    return target;
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

    this.#magnitude = this.head.value;
  }

  explode() {
    let count = 0;
    let node = this.head;

    do {
      if (node.depth === MAX_DEPTH && this.#isPairLeft(node)) {
        if (node.prev) node.prev.value += node.value;
        if (node.next?.next) node.next.next.value += node.next.value;

        node.value = EXPLODE_VALUE;
        node.depth -= 1;
        node.side = node.depth === node.prev?.depth && node.prev?.side === Side.Left ? Side.Right : Side.Left;
        count += 1;

        this.remove(node.next);
      } else if (this.#shouldBePairRight(node)) {
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
      if (this.#isPairLeft(node)) {
        node.value = node.value * 3 + node.next.value * 2;
        node.depth -= 1;
        node.side = node.depth === node.prev?.depth && node.prev?.side === Side.Left ? Side.Right : Side.Left;
        count += 1;

        this.remove(node.next);
      } else if (this.#shouldBePairRight(node)) {
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

    list.head.prev = this.#tail;
    this.#tail.next = list.head;
    this.#tail = list.tail;
    this.#length += list.length;
  }

  toString() {
    let output = '';
    let node = this.#head;

    do {
      output += `${node.value}${DepthChars[node.depth] || DepthChars.Max}`;

      if (node.next) {
        output += this.#isPairLeft(node) ? '-' : ', ';
      }
    } while (node = node.next);

    return `(${output})`;
  }

  #isPairLeft(node) {
    return node.side === Side.Left && node.next?.side === Side.Right && node.depth === node.next?.depth;
  }

  #shouldBePairRight(node) {
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
