// Correct answer: 996

import fs from 'fs';
import util from 'util';

const HEX_SIZE = 4;
const LITERAL_VALUE_TYPE_ID = 4;
const BITS_LENGTH_MODE_ID = 0;
const LAST_NUMBER_PREFIX = 0;
const VERSION_SIZE = 3;
const TYPE_SIZE = 3;
const CHUNK_SIZE = 5;
const MODE_SIZE = 1;
const BITS_LENGTH_SIZE = 15;
const NUMBER_LENGTH_SIZE = 11;

const parseBinary = text =>
  text
    .split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(HEX_SIZE, 0))
    .join('');

const readNextBits = (binary, count) => {
  const bits = binary.substring(0, count);
  const rest = binary.substring(count);

  return [bits, rest];
};

const isLiteralValueNext = binary => {
  const typeBits = binary.substring(VERSION_SIZE, VERSION_SIZE + TYPE_SIZE);
  const type = parseInt(typeBits, 2);

  return type === LITERAL_VALUE_TYPE_ID;
};

const parseLiteralValuePacket = binary => {
  const prevLength = binary.length;

  let versionBits;
  let typeBits;
  let chunkBits;
  let numberBits = '';
  let isLast = false;

  // Parse version and type.
  [versionBits, binary] = readNextBits(binary, VERSION_SIZE);
  [typeBits, binary] = readNextBits(binary, TYPE_SIZE);

  // Parse number chunks and whole number.
  while (!isLast) {
    [chunkBits, binary] = readNextBits(binary, CHUNK_SIZE);

    const prefix = +chunkBits[0];
    const chunk = chunkBits.substring(1);

    numberBits += chunk;
    isLast = prefix === LAST_NUMBER_PREFIX;
  }

  // Parse decimal values and return a packet.
  return [{
    length: prevLength - binary.length,
    version: parseInt(versionBits, 2),
    type: parseInt(typeBits, 2),
    number: parseInt(numberBits, 2),
  }, binary];
};

const bitsLengthSubpackets = binary => {
  let subpackets = [];
  let totalLengthBits;
  let totalLength;
  let packet;

  // Parse total length of sub-packets in bits.
  [totalLengthBits, binary] = readNextBits(binary, BITS_LENGTH_SIZE);
  totalLength = parseInt(totalLengthBits, 2);

  // Parse sub-packets.
  while (totalLength > 0) {
    [packet, binary] = parsePacket(binary);
    subpackets.push(packet);
    totalLength -= packet.length;
  }

  return [subpackets, binary];
};

const numberLengthSubpackets = binary => {
  let subpackets = [];
  let packetsNumberBits;
  let packetsNumber;
  let packet;

  // Parse number of sub-packets.
  [packetsNumberBits, binary] = readNextBits(binary, NUMBER_LENGTH_SIZE);
  packetsNumber = parseInt(packetsNumberBits, 2);

  // Parse sub-packets.
  for (let i = 0; i < packetsNumber; ++i) {
    [packet, binary] = parsePacket(binary);
    subpackets.push(packet);
  }

  return [subpackets, binary];
};

const parseOperatorPacket = binary => {
  const prevLength = binary.length;

  let versionBits;
  let typeBits;
  let modeBits;
  let subpackets;

  // Parse version, type, and mode.
  [versionBits, binary] = readNextBits(binary, VERSION_SIZE);
  [typeBits, binary] = readNextBits(binary, TYPE_SIZE);
  [modeBits, binary] = readNextBits(binary, MODE_SIZE);

  if (+modeBits === BITS_LENGTH_MODE_ID) {
    [subpackets, binary] = bitsLengthSubpackets(binary);
  } else {
    [subpackets, binary] = numberLengthSubpackets(binary);
  }

  return [{
    subpackets,
    length: prevLength - binary.length,
    version: parseInt(versionBits, 2),
    type: parseInt(typeBits, 2),
    mode: parseInt(modeBits, 2),
  }, binary];
};

const parsePacket = binary => {
  let packet;

  if (isLiteralValueNext(binary)) {
    [packet, binary] = parseLiteralValuePacket(binary);
  } else {
    [packet, binary] = parseOperatorPacket(binary);
  }

  return [packet, binary];
};

const sumVersions = packet =>
  !packet.subpackets
    ? packet.version
    : packet.version + packet.subpackets.reduce((sum, p) => sum + sumVersions(p), 0);

try {
  const transmission = fs.readFileSync('inputs/16.txt', 'utf8').trim();
  const binary = parseBinary(transmission);
  const [packet,] = parsePacket(binary);
  const answer = sumVersions(packet);

  console.log(util.inspect(packet, false, null, true));
  console.log(answer);
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
