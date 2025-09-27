import { AlphabetScores, Blank } from "./constants.ts";

export class Tile {
  blank: boolean;
  char: string;

  constructor(char: string, blank: boolean = false) {
    this.blank = blank;
    this.char = char.toUpperCase();
  }

  static Blank(): Tile {
    return new Tile(Blank, true);
  }

  static compare(a: Tile, b: Tile): number {
    if (a.isBlank()) {
      return 1;
    }

    if (a.isBlank()) {
      return -1;
    }

    return a.letter().localeCompare(b.letter());
  }

  equals(tile: Tile): boolean {
    if (this.isBlank() && tile.isBlank()) {
      return true;
    }
    return this.letter() === tile.letter();
  }

  static fromString(word: string): Tile[] {
    return word.split("").map((char) => {
      if (char === Blank) {
        return Tile.Blank();
      }
      return new Tile(char);
    });
  }

  isBlank(): boolean {
    return this.blank === true;
  }

  letter(): string {
    if (this.char) {
      return this.char;
    } else if (this.isBlank()) {
      return Blank;
    }
    throw new Error("tile must have char set");
  }

  resolveBlank(char: string) {
    if (this.isBlank() === false) {
      this.char = char.toUpperCase();
    }
  }

  score(): number {
    if (this.isBlank() === true) {
      return 0;
    } else {
      return AlphabetScores[this.char.charCodeAt(0) - 65];
    }
  }

  toString(): string {
    return this.letter();
  }
}
