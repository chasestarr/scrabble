// import { heapStats } from "bun:jsc";
import { Bag } from "./bag.ts";
import { Board, Move, Directions } from "./board.ts";
import { Dictionary } from "./dictionary.ts";
import { Player } from "./player.ts";
import { Rack } from "./rack.ts";
import { Tile } from "./tiles.ts";

async function main() {
  const b = new Board();
  const d = new Dictionary();
  const bag = new Bag();

  const r = new Rack([]);
  const p = new Player(r);
  let lastMove = null;
  let tossCount = 0;
  console.log("<ul>");
  turn: while (bag.size()) {
    // const start = Bun.nanoseconds() / 1_000_000;
    while (r.size() < 7) {
      const tile = bag.take();
      if (!tile) {
        break;
      }
      r.add(tile);
    }
    console.log("<li>", r.toString(), "</li>");

    const m = p.getMove(b, d);
    if (!m) {
      for (let i = 0; i < Math.floor(r.size() / 2); i++) {
        const toToss = r.random();
        if (!toToss) {
          break;
        }
        r.remove(toToss);
      }

      if (tossCount > 3) {
      } else {
        continue turn;
      }
    }

    console.log("<li>", m.toString(), "</li>");
    if (lastMove && m.equals(lastMove)) {
      break;
    }

    p.playMove(b, m);
    tossCount = 0;
    lastMove = m;
    for (const tile of m.tiles) {
      r.remove(tile);
    }

    // console.log("<li>", Bun.nanoseconds() / 1_000_000 - start, "ms", "</li>");
  }
  console.log("<li>", "player score:", p.score, "</li>");
  console.log("</ul>");

  const html = b.html(d, r);
  console.log(html);

  // console.log(Bun.nanoseconds() / 1_000_000, "ms");
  // const used = heapStats().heapSize / 1024 / 1024;
  // console.log(Math.round(used * 100) / 100, "MB");
}

main();
