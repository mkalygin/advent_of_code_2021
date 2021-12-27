// Correct answer: 580012, 1334238660555542

import fs from 'fs';

class Range {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  get length() {
    return Math.abs(this.max - this.min) + 1;
  }

  get valid() {
    return this.max >= this.min;
  }

  crop(range) {
    this.min = Math.max(this.min, range.min);
    this.max = Math.min(this.max, range.max);
  }

  intersecting(range) {
    const { min: min1, max: max1 } = this;
    const { min: min2, max: max2 } = range;

    return min1 >= min2 && min1 <= max2 ||
      max1 >= min2 && max1 <= max2 ||
      min2 >= min1 && min2 <= max1 ||
      max2 >= min1 && max2 <= max1;
  }

  including(range) {
    const { min: min1, max: max1 } = this;
    const { min: min2, max: max2 } = range;

    return min1 <= min2 && max1 >= max2;
  }

  intersection(range) {
    const { min: min1, max: max1 } = this;
    const { min: min2, max: max2 } = range;

    if (min1 > max2 || max1 < min2) return null;
    if (min1 >= min2 && max1 <= max2) return new Range(min1, max1);
    if (min1 >= min2 && min1 <= max2 && max1 >= max2) return new Range(min1, max2);
    if (min1 <= min2 && max1 >= min2 && max1 <= max2) return new Range(min2, max1);

    return range.intersection(this);
  }

  split(range) {
    const { min: min1, max: max1 } = this;
    const { min: min2, max: max2 } = range;

    if (min1 === min2 && max1 === max2) return [this];
    if (max1 < min2) return [this, range];
    if (min1 > max2) return [range, this];

    const ranges = [];
    const int = this.intersection(range);
    const { min: imin, max: imax } = int;

    if (imin === min1 && imax === max1) {
      ranges.push(new Range(min2, imin - 1));
      ranges.push(int);
      ranges.push(new Range(imax + 1, max2));
    } else if (imin === min2 && imax === max2) {
      ranges.push(new Range(min1, imin - 1));
      ranges.push(int);
      ranges.push(new Range(imax + 1, max1));
    } else if (imin === min1 && imax !== max1) {
      ranges.push(new Range(min2, imin - 1));
      ranges.push(int);
      ranges.push(new Range(imax + 1, max1));
    } else if (imin === min2 && imax !== max2) {
      ranges.push(new Range(min1, imin - 1));
      ranges.push(int);
      ranges.push(new Range(imax + 1, max2));
    }

    return ranges.filter(({ valid }) => valid);
  }
}

class Cuboid {
  static parse(text) {
    const [mode, coords] = text.split(' ');
    const [xmin, xmax, ymin, ymax, zmin, zmax] = coords
      .match(/^x=(.+?)\.\.(.+?),y=(.+?)\.\.(.+?),z=(.+?)\.\.(.+?)$/)
      .slice(1, 7)
      .map(n => +n);

    return new Cuboid({ xmin, xmax, ymin, ymax, zmin, zmax, on: mode === 'on' });
  }

  constructor({ on, xmin, xmax, ymin, ymax, zmin, zmax }) {
    this.on = on;
    this.x = new Range(xmin, xmax);
    this.y = new Range(ymin, ymax);
    this.z = new Range(zmin, zmax);
  }

  get key() {
    const on = this.on ? 'on' : 'off';
    const x = `${this.x.min}..${this.x.max}`;
    const y = `${this.y.min}..${this.y.max}`;
    const z = `${this.z.min}..${this.z.max}`;

    return `${on} x=${x},y=${y},z=${z}`;
  }

  get volume() {
    return this.x.length * this.y.length * this.z.length;
  }

  crop(cub) {
    const { x: x1, y: y1, z: z1 } = this;
    const { x: x2, y: y2, z: z2 } = cub;

    x1.crop(x2);
    y2.crop(y2);
    z2.crop(z2);

    return this;
  }

  intersecting(cub) {
    const { x: x1, y: y1, z: z1 } = this;
    const { x: x2, y: y2, z: z2 } = cub;

    return x1.intersecting(x2) &&
      y1.intersecting(y2) &&
      z1.intersecting(z2);
  }

  including(cub) {
    const { x: x1, y: y1, z: z1 } = this;
    const { x: x2, y: y2, z: z2 } = cub;

    return x1.including(x2) &&
      y1.including(y2) &&
      z1.including(z2);
  }

  intersection(cub) {
    const { on: on1, x: x1, y: y1, z: z1 } = this;
    const { on: on2, x: x2, y: y2, z: z2 } = cub;

    const ix = x1.intersection(x2);
    const iy = y1.intersection(y2);
    const iz = z1.intersection(z2);

    if (!ix || !iy || !iz) return null;

    return new Cuboid({
      on: on1 && on2,
      xmin: ix.min,
      xmax: ix.max,
      ymin: iy.min,
      ymax: iy.max,
      zmin: iz.min,
      zmax: iz.max,
    });
  }

  split(cub) {
    if (!this.intersecting(cub)) return [this];

    const { on: on1, x: x1, y: y1, z: z1 } = this;
    const { on: on2, x: x2, y: y2, z: z2 } = cub;

    const xrs = x1.split(x2);
    const yrs = y1.split(y2);
    const zrs = z1.split(z2);

    const cubs = [];

    for (const xr of xrs) {
      for (const yr of yrs) {
        for (const zr of zrs) {
          const part = new Cuboid({
            on: on1,
            xmin: xr.min,
            xmax: xr.max,
            ymin: yr.min,
            ymax: yr.max,
            zmin: zr.min,
            zmax: zr.max,
          });

          const isIntersecting1 = this.intersecting(part);
          const isIntersecting2 = cub.intersecting(part);

          if (isIntersecting1 && !isIntersecting2) {
            cubs.push(part);
          }
        }
      }
    }

    return cubs;
  }
}

// http://jsfiddle.net/owz8fr5h/67
const BOUNDING_BOX = new Cuboid({
  on: false,
  xmin: -50,
  xmax: 50,
  ymin: -50,
  ymax: 50,
  zmin: -50,
  zmax: 50,
});

try {
  const cubs = fs
    .readFileSync('inputs/22.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(Cuboid.parse);
    // Uncomment for part 1.
    // .filter(cub => cub.intersecting(BOUNDING_BOX))
    // .map(cub => cub.crop(BOUNDING_BOX));

  const c1 = new Cuboid({ xmin: 10, xmax: 10, ymin: 10, ymax: 10, zmin: 11, zmax: 11 });
  const c2 = new Cuboid({ xmin: 9, xmax: 11, ymin: 9, ymax: 11, zmin: 9, zmax: 11 });

  const ons = cubs.reduce((acc, ncub) => {
    if (acc.length === 0) return ncub.on ? [ncub] : [];

    return acc
      .filter(cub => !ncub.including(cub))
      .map(cub => cub.split(ncub))
      .flat()
      .concat(ncub.on ? [ncub] : []);
  }, []);

  const answer = Object
    .values(ons)
    .reduce((acc, cub) => acc + cub.volume, 0);

  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
