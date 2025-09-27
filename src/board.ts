import { AlphabetSet, Blank } from "./constants.ts";
import { Dictionary } from "./dictionary.ts";
import { Rack } from "./rack.ts";
import { Tile } from "./tiles.ts";

export class Vec2 {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  isHorizontal(): boolean {
    return this.y === 0;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  minus(other: Vec2): Vec2 {
    return this.plus(other.mult(-1));
  }

  mult(factor: number): Vec2 {
    return new Vec2(this.x * factor, this.y * factor);
  }

  normalize(): Vec2 {
    const length = this.length();
    if (length > 0) {
      return this.mult(1 / length);
    }
    return this;
  }

  perp(): Vec2 {
    return new Vec2(this.y, this.x);
  }

  plus(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  reflect(normal: Vec2): Vec2 {
    const d = this.dot(normal);
    return new Vec2(this.x - 2 * d * normal.x, this.y - 2 * d * normal.y);
  }

  toArray(): [number, number] {
    return [this.x, this.y];
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

export class Direction extends Vec2 {
  name: string;

  constructor(name: string, x: number, y: number) {
    super(x, y);
    this.name = name;
  }

  toString(): string {
    return this.name;
  }
}

export const North = new Direction("North", 0, -1);
export const East = new Direction("East", 1, 0);
export const South = new Direction("South", 0, 1);
export const West = new Direction("West", -1, 0);
export const Directions = [North, East, South, West];

export class Move {
  direction: Vec2;
  origin: Vec2;
  tiles: Tile[] = [];

  constructor(col: number, row: number, horizontal: boolean, tiles: Tile[]) {
    this.origin = new Vec2(col, row);
    this.direction = horizontal ? East : South;
    this.tiles = tiles;
  }

  end(): Vec2 {
    return this.origin.plus(this.direction.mult(this.tiles.length - 1));
  }

  equals(other: Move): boolean {
    if (
      !this.start().equals(other.start()) ||
      !this.end().equals(other.end())
    ) {
      return false;
    }

    for (let i = 0; i < this.tiles.length; i++) {
      if (!this.tiles[i].equals(other.tiles[i])) {
        return false;
      }
    }

    return true;
  }

  start(): Vec2 {
    return this.origin;
  }

  toString() {
    return `new Move(${this.origin.x}, ${
      this.origin.y
    }, ${this.direction.isHorizontal()}, Tile.fromString("${this.tiles
      .map((t) => t.letter())
      .join("")}"))`;
    // return `${this.origin.toString()} ${
    //   this.direction.isHorizontal() ? "&#8594;" : "&#8595;"
    // } ${this.tiles}`;
  }
}

export class Board {
  tiles: Array<Tile | undefined> = [];
  empty: boolean = true;
  halo: boolean[] = [];
  height: number = 15;
  hv: Array<Set<string>> = [];
  width: number = 15;

  constructor() {
    const center = new Vec2((this.height - 1) / 2, (this.width - 1) / 2);
    this.halo[this.getLocation(center)] = true;
  }

  isInHV(position: Vec2, char: string): boolean {
    if (!this.isHalo(position)) {
      return true;
    }

    const hv = this.hv[this.getLocation(position)];
    if (!hv) {
      return false;
    }

    return hv.has(char);
  }

  setHV(dictionary: Dictionary, rack: Rack) {
    const rackSet = new Set([...rack.toString()]);
    const hv = [];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const position = new Vec2(col, row);
        if (this.isHalo(position) && !this.getTile(position)) {
          let v = new Set(AlphabetSet);
          let h = new Set(AlphabetSet);

          const west = this.tilesInDirection(position, West).reverse();
          const east = this.tilesInDirection(position, East);
          if (west.length || east.length) {
            const str =
              west.map((t) => t.letter()).join("") +
              Blank +
              east.map((t) => t.letter()).join("");
            v = dictionary.completes(str);
          }

          const north = this.tilesInDirection(position, North).reverse();
          const south = this.tilesInDirection(position, South);
          if (north.length || south.length) {
            const str =
              north.map((t) => t.letter()).join("") +
              Blank +
              south.map((t) => t.letter()).join("");
            h = dictionary.completes(str);
          }

          function intersection(a, b) {
            const x = new Set();
            for (const e of a) {
              if (b.has(e)) x.add(e);
            }
            return x;
          }

          hv[this.getLocation(position)] = intersection(
            intersection(h, v),
            rackSet
          );
        }
      }
    }

    this.hv = hv;
  }

  tilesInDirection(start: Vec2, direction: Vec2): Tile[] {
    const tiles = [];

    let position = start.plus(direction);
    let next = this.getTile(position);
    while (next) {
      tiles.push(next);
      position = position.plus(direction);
      next = this.getTile(position);
    }

    return tiles;
  }

  tilesInDirections(start: Vec2): Map<Direction, Tile[]> {
    const map = new Map();
    map.set(North, this.tilesInDirection(start, North).reverse());
    map.set(East, this.tilesInDirection(start, East));
    map.set(South, this.tilesInDirection(start, South));
    map.set(West, this.tilesInDirection(start, West).reverse());
    return map;
  }

  format(): string {
    const lines = [];
    for (let row = 0; row < this.height; row++) {
      const line = [];
      for (let col = 0; col < this.width; col++) {
        const position = new Vec2(col, row);
        const tile = this.getTile(position);
        const letter = tile ? tile.letter() : "_";
        line.push(letter);
      }
      lines.push(line.join(" "));
    }
    return lines.join("\n");
  }

  getLetterMultiplier(position: Vec2): number {
    return letterMultipliers[this.getLocation(position)];
  }

  getLocation(position: Vec2): number {
    return this.width * position.y + position.x;
  }

  getTile(position: Vec2): Tile | undefined {
    return this.tiles[this.getLocation(position)];
  }

  getWordMultiplier(position: Vec2): number {
    return wordMultipliers[this.getLocation(position)];
  }

  html(dictionary: Dictionary, rack: Rack): string {
    const cellSize = 44;
    const haloColor = "#1D8348";
    const html = [];

    this.setHV(dictionary, rack);

    html.push(`
      <style>
        html {
          margin: 16px;
        }

        .board {
          border-collapse: collapse;
          font-family: system-ui;
        }

        .cell {
          background-color: gainsboro;
          border-color: white;
          border-style: solid;
          border-width: 2px;
          font-size: 24px;
          height: ${cellSize}px;
          position: relative;
          text-align: center;
          width: ${cellSize}px;
        }

        .score {
          bottom: 0;
          font-size: 14px;
          position: absolute;
          right: 2;
        }

        .hv {
          color: #373737;
          font-size: 10px;
          height: ${cellSize}px;
          left: 2;
          position: absolute;
          text-align: start;
          top: 0;
          width: ${cellSize}px;
          word-break: break-word;
        }

        .cell .hv {
          display: block;
        }

        .cell:hover .hv {
          display: block;
        }

        .double-letter {
          background-color: cornflowerblue;
        }

        .triple-letter {
          background-color: slateblue;
        }

        .double-word {
          background-color: palevioletred;
        }

        .triple-word {
          background-color: firebrick;
        }

        .halo-top {
          border-top-color: ${haloColor};
          border-top-width: 2.5px;
        }

        .halo-right {
          border-right-color: ${haloColor};
          border-right-width: 2.5px;
        }

        .halo-bottom {
          border-bottom-color: ${haloColor};
          border-bottom-width: 2.5px;
        }

        .halo-left {
          border-left-color: ${haloColor};
          border-left-width: 2.5px;
        }
      </style>
    `);

    html.push('<table class="board">');
    html.push('<tbody align="center">');
    html.push("<thead>");
    html.push("<tr>");
    html.push("<th></th>");
    for (let col = 0; col < this.height; col++) {
      html.push(`<th>${col}</th>`);
    }
    html.push("</tr>");
    html.push("</thead>");
    for (let row = 0; row < this.height; row++) {
      html.push("<tr>");
      html.push(`<th scope="row">${row}</th>`);
      for (let col = 0; col < this.height; col++) {
        const position = new Vec2(col, row);
        const cellClasses = ["cell"];

        const lm = this.getLetterMultiplier(position);
        const wm = this.getWordMultiplier(position);
        if (lm === 2) {
          cellClasses.push("double-letter");
        } else if (lm === 3) {
          cellClasses.push("triple-letter");
        } else if (wm === 2) {
          cellClasses.push("double-word");
        } else if (wm === 3) {
          cellClasses.push("triple-word");
        }

        if (this.isHalo(position)) {
          if (!this.isHalo(position.plus(West))) {
            cellClasses.push("halo-left");
          }

          if (!this.isHalo(position.plus(East))) {
            cellClasses.push("halo-right");
          }

          if (!this.isHalo(position.plus(North))) {
            cellClasses.push("halo-top");
          }

          if (!this.isHalo(position.plus(South))) {
            cellClasses.push("halo-bottom");
          }
        }

        const tile = this.getTile(position);
        const tileHv = this.hv[this.getLocation(position)];
        const letter = tile ? tile.letter() : "";
        const score = tile ? tile.score().toString() : "";

        let hvStr = "";
        if (tileHv) {
          if (tileHv.size === AlphabetSet.size) {
            hvStr = "*";
          } else if (tileHv.size === 0) {
            hvStr = "-";
          } else {
            hvStr = [...tileHv].join("");
          }
        }

        html.push(`
          <td class="${cellClasses.join(" ")}">
            <div class="hv">${hvStr}</div>
            ${letter}
            <div class="score">${score}</div>
          </td>
        `);
      }
      html.push("</tr>");
    }
    html.push("</tbody>");
    html.push("</table>");

    return html.join("\n");
  }

  isEmpty(): boolean {
    return this.empty;
  }

  isHalo(position: Vec2): boolean {
    return this.halo[this.getLocation(position)];
  }

  isOutOfBounds(position: Vec2): boolean {
    return (
      position.x < 0 ||
      position.x >= this.width ||
      position.y < 0 ||
      position.y >= this.height
    );
  }

  playMove(move: Move): void {
    this.empty = false;

    let position = move.start();
    for (const tile of move.tiles) {
      this.setTile(position, tile);
      this.setHalo(position);
      position = position.plus(move.direction);
    }

    this.hv = [];
  }

  scoreMove(move: Move): number {
    let includesHalo = false;
    let otherScore = 0;
    let multiplier = 1;
    let newTileCount = 0;
    let position = move.start();
    let score = 0;

    if (
      this.getTile(move.start().minus(move.direction)) ||
      this.getTile(move.end().plus(move.direction))
    ) {
      return -1;
    }

    for (let i = 0; i < move.tiles.length; i++) {
      if (this.isOutOfBounds(position)) {
        return -1;
      }

      const tile = move.tiles[i];
      const existing = this.getTile(position);

      includesHalo = includesHalo || this.isHalo(position);

      if (existing) {
        if (!existing.equals(tile)) {
          return -1;
        }
        score += tile.score();
      } else if (!existing) {
        newTileCount += 1;

        const lm = this.getLetterMultiplier(position);
        const wm = this.getWordMultiplier(position);
        score += tile.score() * lm;
        multiplier *= wm;

        let pScore = 0;
        const prefixDir = move.direction.reflect(new Vec2(1, 1).normalize());
        const prefix = this.tilesInDirection(position, prefixDir).reverse();
        const suffix = this.tilesInDirection(position, prefixDir.mult(-1));

        if (prefix.length || suffix.length) {
          if (!this.isInHV(position, tile.letter())) {
            return -1;
          }

          pScore = tile.score() * lm;
        }
        for (const t of prefix) {
          pScore += t.score();
        }
        for (const t of suffix) {
          pScore += t.score();
        }
        otherScore += pScore * wm;
      }

      position = position.plus(move.direction);
    }

    if (!includesHalo || !newTileCount) {
      return -1;
    }

    if (newTileCount >= 7) {
      otherScore += 50;
    }

    return score * multiplier + otherScore;
  }

  setHalo(position: Vec2): void {
    if (position.y >= 1) {
      this.halo[this.getLocation(position.plus(North))] = true;
    }

    if (position.y < this.height - 1) {
      this.halo[this.getLocation(position.plus(South))] = true;
    }

    if (position.x >= 1) {
      this.halo[this.getLocation(position.plus(West))] = true;
    }

    if (position.x < this.width - 1) {
      this.halo[this.getLocation(position.plus(East))] = true;
    }
  }

  setTile(position: Vec2, tile: Tile): void {
    this.tiles[this.getLocation(position)] = tile;
  }
}

// prettier-ignore
const letterMultipliers = [
  1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1,
  1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1,
  1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
  1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1,
  1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
];

// prettier-ignore
const wordMultipliers = [
  3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3,
  1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
  1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1,
  1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
  1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
  1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
  1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1,
  1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
  3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3,
];
