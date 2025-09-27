import { describe, expect, test } from "bun:test";
import { Board, Move } from "./board.ts";
import { Dictionary } from "./dictionary.ts";
import { Rack } from "./rack.ts";
import { Tile } from "./tiles.ts";

const d = new Dictionary();

describe("scoreMove", () => {
  const cases = [
    {
      title: "empty board five letter",
      move: new Move(7, 7, true, Tile.fromString("aargh")),
      previous: [],
      rack: new Rack(Tile.fromString("aargh")),
      expected: 26,
    },
    {
      title: "empty board seven letter",
      move: new Move(7, 7, true, Tile.fromString("odyssey")),
      previous: [],
      rack: new Rack(Tile.fromString("odyssey")),
      expected: 80,
    },
    {
      title: "joins from initial character",
      move: new Move(9, 7, false, Tile.fromString("yikes")),
      previous: [new Move(7, 7, true, Tile.fromString("odyssey"))],
      rack: new Rack(Tile.fromString("ikes")),
      expected: 22,
    },
    {
      title: "joins from last character",
      move: new Move(10, 3, false, Tile.fromString("yikes")),
      previous: [new Move(7, 7, true, Tile.fromString("odyssey"))],
      rack: new Rack(Tile.fromString("yike")),
      expected: 24,
    },
    {
      title: "joins from middle character",
      move: new Move(12, 4, false, Tile.fromString("yikes")),
      previous: [new Move(7, 7, true, Tile.fromString("odyssey"))],
      rack: new Rack(Tile.fromString("yiks")),
      expected: 18,
    },
    {
      title: "join parallel",
      move: new Move(4, 6, true, Tile.fromString("anise")),
      previous: [new Move(7, 7, true, Tile.fromString("odyssey"))],
      rack: new Rack(Tile.fromString("anise")),
      expected: 13,
    },
    {
      title: "join parallel not in hv",
      move: new Move(4, 6, true, Tile.fromString("anises")),
      previous: [new Move(7, 7, true, Tile.fromString("odyssey"))],
      rack: new Rack(Tile.fromString("anises")),
      expected: -1,
    },
  ];

  for (const c of cases) {
    test(c.title, () => {
      const b = new Board();
      for (const m of c.previous) {
        b.playMove(m);
      }
      b.setHV(d, c.rack);
      const score = b.scoreMove(c.move);
      expect(score).toBe(c.expected);
    });
  }
});
