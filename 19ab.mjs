// Correct answer: 496, 14478

import fs from 'fs';
import util from 'util';

class Vector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get key() {
    return `${this.x},${this.y},${this.z}`;
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }

  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z;
  }

  sub({ x, y, z }) {
    return new Vector(this.x - x, this.y - y, this.z - z);
  }

  dist({ x, y, z }) {
    return Math.abs(this.x - x) + Math.abs(this.y - y) + Math.abs(this.z - z);
  }

  rotate({ rxy, rxz, ryx, ryz, rzx, rzy }) {
    [this.y, this.z] = [this.dot(rxy), this.dot(rxz)];
    [this.x, this.z] = [this.dot(ryx), this.dot(ryz)];
    [this.x, this.y] = [this.dot(rzx), this.dot(rzy)];

    return this;
  }

  translate({ x, y, z }) {
    this.x += x;
    this.y += y;
    this.z += z;

    return this;
  }
}

class Scanner {
  static parse(text) {
    const rows = text.split('\n').filter(Boolean);
    const id = +rows.shift().replace(/[^\d]/g, '');
    const beacons = rows.map(row => new Vector(...row.split(',').map(c => +c)));

    return new Scanner(id, beacons);
  }

  constructor(id, beacons) {
    this.id = id;
    this.initial = beacons;
    this.beacons = beacons;
    this.origin = new Vector(0, 0, 0);
    this.rotation = new Vector(0, 0, 0);
    this.translation = new Vector(0, 0, 0);
    this.commons = [];
  }

  rotate({ x = 0, y = 0, z = 0 } = {}) {
    this.rotation = new Vector(x, y, z);

    const [rx, ry, rz] = [Math.PI * x / 2, Math.PI * y / 2, Math.PI * z / 2];

    const rxy = new Vector(0, this.cos(rx), this.sin(rx));
    const rxz = new Vector(0, -this.sin(rx), this.cos(rx));

    const ryx = new Vector(this.cos(ry), 0, -this.sin(ry));
    const ryz = new Vector(this.sin(ry), 0, this.cos(ry));

    const rzx = new Vector(this.cos(rz), this.sin(rz), 0);
    const rzy = new Vector(-this.sin(rz), this.cos(rz), 0);

    this.origin.rotate({ rxy, rxz, ryx, ryz, rzx, rzy });

    this.beacons = this.beacons.map(beacon =>
      beacon.clone().rotate({ rxy, rxz, ryx, ryz, rzx, rzy })
    );
  }

  translate({ x = 0, y = 0, z = 0 } = {}) {
    this.translation = new Vector(x, y, z);

    this.origin.translate({ x, y, z });

    this.beacons = this.beacons.map(beacon =>
      beacon.clone().translate({ x, y, z })
    );
  }

  reset() {
    this.beacons = this.initial;
    this.origin = new Vector(0, 0, 0);
    this.rotation = new Vector(0, 0, 0);
    this.translation = new Vector(0, 0, 0);
  }

  commonize(scanner) {
    ROTATIONS.some(rotation => {
      const diffs = {};

      scanner.reset();
      scanner.rotate(rotation);

      this.beacons.forEach(vec1 => {
        scanner.beacons.forEach(vec2 => {
          const diff = vec1.sub(vec2);

          diffs[diff.key] = diffs[diff.key] ?? { value: diff, count: 0 };
          diffs[diff.key].count += 1;
        });
      });

      const translation = Object
        .values(diffs)
        .find(({ count }) => count >= MIN_COMMON_BEACONS)
        ?.value;

      if (translation) {
        scanner.commons.push({ scanner: this, rotation, translation });
      }

      return !!translation;
    });

    scanner.reset();
  }

  transformTo(targetId) {
    this.findTransforms(targetId, this.commons)
      ?.forEach(({ rotation, translation }) => {
        this.rotate(rotation);
        this.translate(translation);
      });
  }

  findTransforms(targetId, commons, transforms = []) {
    return commons
      .map(common => {
        const nextTransforms = [...transforms];
        const nextTransformIds = nextTransforms.map(transform => transform.scanner.id);

        nextTransforms.push(common);

        const { scanner } = common;
        const nextCommons = scanner.commons.filter(ncommon =>
          !nextTransformIds.includes(ncommon.scanner.id)
        );

        if (scanner.id === targetId) return nextTransforms;
        if (nextCommons.length === 0) return null;

        return this.findTransforms(targetId, nextCommons, nextTransforms);
      })
      .find(transforms => !!transforms);
  }

  // Fix floating point error.
  sin(x) {
    return Math.sin(x) + 8 - 8;
  }

  // Fix floating point error.
  cos(x) {
    return Math.cos(x) + 8 - 8;
  }

  toString() {
    return this.beacons
      .map(beacon => beacon.key)
      .join('\n');
  }
}

const MIN_COMMON_BEACONS = 12;

const ROTATIONS = [
  new Vector(0, 0, 0),

  new Vector(1, 0, 0),
  new Vector(2, 0, 0),
  new Vector(3, 0, 0),

  new Vector(0, 1, 0),
  new Vector(0, 2, 0),
  new Vector(0, 3, 0),

  new Vector(0, 0, 1),
  new Vector(0, 0, 2),
  new Vector(0, 0, 3),

  new Vector(3, 3, 0),
  new Vector(3, 0, 3),
  new Vector(0, 3, 3),

  new Vector(1, 1, 0),
  new Vector(1, 0, 1),
  new Vector(1, 1, 2),

  new Vector(3, 1, 3),
  new Vector(3, 3, 1),

  new Vector(0, 2, 3),
  new Vector(3, 0, 2),

  new Vector(0, 2, 1),
  new Vector(1, 0, 2),

  new Vector(1, 2, 3),
  new Vector(3, 2, 1),
];

try {
  const scanners = fs
    .readFileSync('inputs/19.txt', 'utf8')
    .split('\n\n')
    .map(Scanner.parse);

  const origin = scanners[0];

  scanners.forEach(scanner1 => {
    scanners.forEach(scanner2 => {
      if (scanner1.id === scanner2.id) return;

      scanner1.commonize(scanner2);
    });
  });

  scanners.forEach(scanner => {
    if (scanner.id === origin.id) return;

    scanner.transformTo(origin.id);
  });

  const answer1 = new Set(
    scanners
    .map(scanner => scanner.beacons.map(beacon => beacon.key))
    .flat()
  ).size;

  const answer2 = scanners.reduce((acc, scanner1) => {
    return Math.max(acc, ...scanners.map(scanner2 => scanner1.origin.dist(scanner2.origin)));
  }, Number.MIN_VALUE);

  console.log(`beacons = ${answer1}, max distance = ${answer2}`);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
