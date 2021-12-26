// Correct answer: 51983999947999, 11211791111365

import fs from 'fs';
import util from 'util';
import cliProgress from 'cli-progress';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const execute = (program, { step, input, value, w = 0, x = 0, y = 0, z = 0 } = {}) => {
  const digits = input.split('');

  const inp = () => +digits.shift();
  const add = (a, b) => a + b;
  const mul = (a, b) => a * b;
  const div = (a, b) => Math.floor(a / b);
  const mod = (a, b) => a % b;
  const eql = (a, b) => a === b ? 1 : 0;

  if (!step && program) {
    eval(program);
  } else {
    const incz = (a, b) => {
      w = inp(w);
      x = mul(x, 0);
      x = add(x, z);
      x = mod(x, 26);
      z = div(z, 1);
      x = add(x, a);
      x = eql(x, w);
      x = eql(x, 0);
      y = mul(y, 0);
      y = add(y, 25);
      y = mul(y, x);
      y = add(y, 1);
      z = mul(z, y);
      y = mul(y, 0);
      y = add(y, w);
      y = add(y, b);
      y = mul(y, x);
      z = add(z, y);
    };

    const decz = (a, b) => {
      w = inp(w);
      x = mul(x, 0);
      x = add(x, z);
      x = mod(x, 26);
      z = div(z, 26);
      x = add(x, a);
      x = eql(x, w);
      x = eql(x, 0);
      y = mul(y, 0);
      y = add(y, 25);
      y = mul(y, x);
      y = add(y, 1);
      z = mul(z, y);
      y = mul(y, 0);
      y = add(y, w);
      y = add(y, b);
      y = mul(y, x);
      z = add(z, y);
    };

    if (!step || step === 1) {
      incz(11, 6);
      incz(11, 14);
      incz(15, 13);
      decz(-14, 1);
    }

    if (!step || step === 2) {
      incz(10, 6);
      decz(0, 13);
    }

    if (!step || step === 3) {
      decz(-6, 6);
    }

    if (!step || step === 4) {
      incz(13, 3);
      decz(-3, 8);
    }

    if (!step || step === 5) {
      incz(13, 14);
      incz(15, 4);
      decz(-2, 7);
    }

    if (!step || step === 6) {
      decz(-9, 15);
      decz(-2, 1);
    }
  }

  return { input, value, w, x, y, z, result: !step || step === 6 ? z === 0 : x === 0 };
}

try {
  const program = fs
    .readFileSync('inputs/24.txt', 'utf8')
    .replace(/^(inp)\s+([^\s=]+)$/mg, "$2 = $1($2);")
    .replace(/^(add|mul|div|mod|eql)\s+([^\s=]+)\s+([^\s=]+)$/mg, "$2 = $1($2, $3);");

  const steps = {
    1: { versions: [1111, 9999], candidates: [{ input: '', value: '', w: 0, x: 0, y: 0, z: 0 }] },
    2: { versions: [11, 99], candidates: [] },
    3: { versions: [1, 9], candidates: [] },
    4: { versions: [11, 99], candidates: [] },
    5: { versions: [111, 999], candidates: [] },
    6: { versions: [11, 99], candidates: [] },
    7: { versions: [], candidates: [] },
  };

  Object.entries(steps).forEach(([stepId, { versions, candidates }]) => {
    const step = +stepId;
    const [vmin, vmax] = versions;

    if (!versions) return;

    console.log(`step #${step}`);
    bar.start(candidates.length - 1, 0);

    candidates.forEach((candidate, index) => {
      bar.update(index);

      for (let version = vmax; version >= vmin; --version) {
        const input = version.toString();
        const value = `${candidate.value}${version}`;
        const { result, ...newCandidate } = execute(null, { ...candidate, step, input, value });

        if (result) {
          steps[step + 1].candidates.push(newCandidate);
        }
      }
    });

    bar.stop();
  });

  const answer1 = steps[7].candidates.shift().value;
  const answer2 = steps[7].candidates.pop().value;

  console.log(`max = ${answer1}, min = ${answer2}`);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
