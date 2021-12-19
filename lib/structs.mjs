export class DLNode {
  constructor({ value, next = null, prev = null }) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

export class DLList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  createNode(attrs = {}) {
    return new DLNode(attrs);
  }

  append(attrs = {}) {
    const node = this.createNode(attrs);

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.length += 1;

    return node;
  }

  prepend(attrs = {}) {
    const node = this.createNode(attrs);

    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.length += 1;

    return node;
  }

  insertAt(index, attrs = {}) {
    if (!Number.isInteger(index) || index < 0 || index > this.length) {
      throw new Error('Invalid index');
    }

    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const node = this.createNode(attrs);
    const target = this.findAt(index);

    node.prev = target.prev;
    node.next = target;
    target.prev.next = node;
    target.prev = node;

    this.length += 1;

    return node;
  }

  insertNext(target, attrs = {}) {
    const node = this.createNode(attrs);

    if (target === this.tail) {
      node.prev = target;
      target.next = node;
      this.tail = node;
    } else {
      node.prev = target;
      node.next = target.next;
      target.next.prev = node;
      target.next = node;
    }

    this.length += 1;

    return target;
  }

  insertPrev(target, attrs = {}) {
    const node = this.createNode(attrs);

    if (target === this.head) {
      node.next = target;
      target.prev = node;
      this.head = node;
    } else {
      node.prev = target.prev;
      node.next = target;
      target.prev.next = node;
      target.prev = node;
    }

    this.length += 1;

    return target;
  }

  removeAt(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.length - 1) {
      throw new Error('Invalid index');
    }

    const target = this.findAt(index);

    return this.remove(target);
  }

  remove(target) {
    if (target === this.head) {
      this.head = target.next;
      this.head.prev = null;
    } else if (target === this.tail) {
      this.tail = target.prev;
      this.tail.next = null;
    } else {
      target.prev.next = target.next;
      target.next.prev = target.prev;
    }

    this.length -= 1;

    return target;
  }

  findAt(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.length - 1) {
      throw new Error('Invalid index');
    }

    let target = this.head;

    for (let i = 1; i <= index; ++i) {
      target = target.next;
    }

    return target;
  }

  toString() {
    let output = '';
    let node = this.head;

    do {
      output += node.value;
      if (node.next) output += ', ';
    } while (node = node.next);

    return `(${output})`;
  }
}
