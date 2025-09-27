import { readFileSync } from "node:fs";

const file = readFileSync("word-list.txt");
const map = new Map();

let word = [];
let offset = 0;
while (offset < file.length) {
  const byte = file.readUInt8(offset);
  if (byte === 10) {
    const n = word.length;
    const count = map.get(n);

    if (2 <= n && n <= 15) {
      if (typeof count !== "number") {
        map.set(n, 1);
      } else {
        map.set(n, count + 1);
      }
    }

    word = [];
  } else {
    word.push(byte);
  }

  offset += 1;
}

function factorial(n: number): number {
  return n == 1 || n == 0 ? 1 : n * factorial(n - 1);
}

let size = 0;
for (const [key, value] of map) {
  size += factorial(key) * value * 8;
}

console.log(map);
console.log(size);
