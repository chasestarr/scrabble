import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { alphaCompare } from "./alpha-compare.ts";
import { Blank } from "./constants.ts";

function buildIndex(inDir: string, outDir: string, n: number) {
  const aIndex = [];
  const directs = readFileSync(join(inDir, `direct-${n}.txt`), "utf-8");
  for (const direct of directs.split("\n")) {
    const sDirect = [...direct].sort(alphaCompare).join("");
    const anagrams = new Set([sDirect]);

    for (let i = 0; i < sDirect.length; i++) {
      for (let j = 0; j < sDirect.length; j++) {
        const p = [...sDirect];
        p[i] = Blank;
        p[j] = Blank;

        const pp = p.sort(alphaCompare).join("");
        anagrams.add(pp);
      }
    }

    const aAnagrams = [...anagrams].sort(alphaCompare);
    for (const anagram of aAnagrams) {
      aIndex.push({ direct, anagram });
    }
  }

  aIndex.sort((a, b) => {
    if (a.anagram === b.anagram) {
      return alphaCompare(a.direct, b.direct);
    }
    return alphaCompare(a.anagram, b.anagram);
  });

  const indices = [];
  let prevAnagram = "";
  for (let i = 0; i < aIndex.length; i++) {
    const current = aIndex[i];
    if (prevAnagram !== current.anagram) {
      indices.push(`${current.anagram} ${i}`);
      prevAnagram = current.anagram;
    }
  }

  writeFileSync(join(outDir, `index-${n}.txt`), indices.join("\n"));
  writeFileSync(
    join(outDir, `anagrams-${n}.txt`),
    aIndex.map((x) => x.direct).join("\n")
  );
}

function main() {
  const inDir = process.env["IN_DIR"];
  const outDir = process.env["OUT_DIR"];
  if (!inDir || !outDir) {
    throw new Error("IN_DIR and OUT_DIR must be set");
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir);

  const min = 2;
  const max = 15;
  for (let i = min; i <= max; i++) {
    buildIndex(inDir, outDir, i);
  }
}

main();
