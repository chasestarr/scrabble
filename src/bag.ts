import { AlphabetCounts } from "./constants.ts";
import { Tile } from "./tiles.ts";
import { shuffle } from "./shuffle.ts";

export class Bag {
  tiles: Tile[];

  constructor() {
    this.tiles = [];
    for (let i = 0; i < AlphabetCounts.length; i++) {
      for (let j = 0; j < AlphabetCounts[i]; j++) {
        this.tiles.push(new Tile(String.fromCharCode(i + 65)));
      }
    }
    this.shuffle();
  }

  shuffle() {
    this.tiles = shuffle(this.tiles);
  }

  size() {
    return this.tiles.length;
  }

  take(): Tile | undefined {
    return this.tiles.pop();
  }
}
