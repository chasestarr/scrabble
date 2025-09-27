import { alphaCompare } from "./alpha-compare.ts";
import { subsets } from "./permutations.ts";
import { Tile } from "./tiles.ts";

export class Rack {
  tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
    this.sort();
  }

  add(tile: Tile): void {
    this.tiles.push(tile);
    this.sort();
  }

  getTiles(): Tile[] {
    return this.tiles;
  }

  hasLetter(letter: string): boolean {
    let start = 0;
    let end = this.tiles.length - 1;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const compare = alphaCompare(this.tiles[mid].letter(), letter);

      if (compare === 0) {
        return true;
      } else if (compare === -1) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    return false;
  }

  hasTile(tile: Tile): boolean {
    return this.hasLetter(tile.letter());
  }

  isEmpty(): boolean {
    return this.tiles.length === 0;
  }

  random(): Tile | undefined {
    const index = Math.random() * this.size();
    return this.tiles[index];
  }

  remove(tile: Tile): void {
    const next = [];

    let found = false;
    for (const t of this.tiles) {
      if (found === false && t.equals(tile)) {
        found = true;
      } else {
        next.push(t);
      }
    }

    this.tiles = next;
  }

  score(): number {
    let sum = 0;

    for (const tile of this.tiles) {
      sum += tile.score();
    }

    return sum;
  }

  setTiles(tiles: Tile[]): void {
    this.tiles = tiles;
    this.tiles.sort();
  }

  size(): number {
    return this.tiles.length;
  }

  sort(): void {
    this.tiles.sort(Tile.compare);
  }

  subracks(additional: Tile[] = []): Rack[] {
    return subsets(this.tiles.concat(additional)).map(
      (tiles) => new Rack(tiles)
    );
  }

  toString(): string {
    return this.tiles.map((t) => t.letter()).join("");
  }
}
