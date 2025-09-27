import { describe, expect, test } from "bun:test";
import { Board, Move } from "./board.ts";
import { Dictionary } from "./dictionary.ts";
import { Player } from "./player.ts";
import { Rack } from "./rack.ts";
import { Tile } from "./tiles.ts";

const dictionary = new Dictionary();

const cases = [
  {
    title: "empty board five letter",
    expected: new Move(7, 6, false, Tile.fromString("aargh")),
    previous: [],
    rack: new Rack(Tile.fromString("aargh")),
  },
  {
    title: "empty board seven letter",
    expected: new Move(6, 7, true, Tile.fromString("odyssey")),
    previous: [],
    rack: new Rack(Tile.fromString("odyssey")),
  },
  {
    title: "second turn",
    expected: new Move(9, 7, false, Tile.fromString("sikes")),
    previous: [new Move(6, 7, true, Tile.fromString("odyssey"))],
    rack: new Rack(Tile.fromString("ikes")),
  },
  {
    title: "fuzz",
    expected: new Move(9, 10, true, Tile.fromString("roadie")),
    previous: [
      new Move(7, 6, false, Tile.fromString("ajee")),
      new Move(8, 6, false, Tile.fromString("bods")),
      new Move(9, 5, false, Tile.fromString("lag")),
      new Move(6, 8, false, Tile.fromString("tholoi")),
      new Move(9, 5, true, Tile.fromString("larky")),
      new Move(9, 9, false, Tile.fromString("trim")),
      new Move(9, 12, true, Tile.fromString("maquis")),
      new Move(7, 11, false, Tile.fromString("info")),
    ],
    rack: new Rack(Tile.fromString("ADEIOTU")),
  },
];

describe("getMove", () => {
  for (const c of cases) {
    test(c.title, () => {
      const board = new Board();
      for (const move of c.previous) {
        board.playMove(move);
      }
      const player = new Player(c.rack);
      const actual = player.getMove(board, dictionary);
      board.playMove(actual);
      if (c.debug) {
        console.log(board.format());
        console.log(actual.toString());
      }
      expect(actual.equals(c.expected)).toBe(true);
    });
  }
});
