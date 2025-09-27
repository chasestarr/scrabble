import { readFileSync } from "node:fs";
import { alphaCompare } from "./alpha-compare.ts";
import { Blank } from "./constants.ts";

type IndexEntry = {
  letters: string;
  pointer: number;
};

class IndexReader {
  indexPath: string;
  anagramsPath: string;
  index: IndexEntry[];
  anagrams: string[];

  constructor(n: number) {
    this.indexPath = `index/index-${n}.txt`;
    this.anagramsPath = `index/anagrams-${n}.txt`;
    this.index = [];
    this.anagrams = [];
  }

  readIndex() {
    const indexContent = readFileSync(this.indexPath, "utf-8");

    for (const line of indexContent.split("\n")) {
      const [letters, pointer] = line.split(" ");
      this.index.push({ letters, pointer: parseInt(pointer) });
    }

    const anagramsContent = readFileSync(this.anagramsPath, "utf-8");
    this.anagrams = anagramsContent.split("\n");
  }

  getAnagrams(letters: string) {
    if (this.index.length === 0 && this.anagrams.length === 0) {
      this.readIndex();
    }

    let start = 0;
    let end = this.index.length - 1;

    let i = -1;
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const compare = alphaCompare(this.index[mid].letters, letters);

      if (compare === 0) {
        i = mid;
        break;
      } else if (compare === -1) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    if (i === -1) {
      // throw new Error(`letters ${letters} not found in index`);
      return [];
    }

    const current = this.index[i];
    const next = this.index[i + 1];
    const min = current.pointer;
    const max = next ? next.pointer : min + 1;

    return this.anagrams.slice(min, max);
  }
}

export class Dictionary {
  indices: IndexReader[];

  constructor() {
    this.indices = [];
    for (let i = 2; i <= 15; i++) {
      const index = new IndexReader(i);
      this.indices.push(index);
    }
  }

  anagrams(letters: string): string[] {
    const index = this.indices[letters.length - 2];

    if (!index) {
      return [];
    }

    return index.getAnagrams(letters);
  }

  completes(word: string): Set<string> {
    const split = word.split("");
    const sorted = [...split].sort(alphaCompare).join("");
    const anagrams = this.anagrams(sorted);
    const index = split.indexOf(Blank);
    const set = new Set<string>();
    for (const anagram of anagrams) {
      let match = true;
      for (let i = 0; i < word.length; i++) {
        if (i !== index && word[i] !== anagram[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        set.add(anagram[index]);
      }
    }
    return set;
  }

  exists(word: string): boolean {
    const sorted = [...word].sort().join("");
    const anagrams = this.anagrams(sorted);
    return anagrams.includes(word);
  }
}
