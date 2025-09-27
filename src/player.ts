import { Board, Directions, Move, Vec2 } from "./board.ts";
import { Dictionary } from "./dictionary.ts";
import { Rack } from "./rack.ts";
import { shuffle } from "./shuffle.ts";
import { Tile } from "./tiles.ts";

export class Player {
  rack: Rack;
  score: number;

  constructor(rack: Rack) {
    this.rack = rack;
    this.score = 0;
  }

  getMove(board: Board, dictionary: Dictionary): Move | undefined {
    board.setHV(dictionary, this.rack);

    let bestScore = -1;
    let bestMove;

    for (let row = 0; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        const position = new Vec2(col, row);
        if (board.isHalo(position)) {
          const directions = board.tilesInDirections(position);
          for (const direction of shuffle(Directions)) {
            const subracks = this.rack.subracks(directions.get(direction));
            const allAnagrams = [];
            for (const subrack of subracks) {
              const letters = subrack.toString();
              const subrackAnagrams = dictionary.anagrams(letters);
              for (const subrackAnagram of subrackAnagrams) {
                allAnagrams.push(subrackAnagram);
              }
            }
            for (const anagram of shuffle(allAnagrams)) {
              for (let i = 0; i < anagram.length; i++) {
                const w = position.plus(direction);
                const move = new Move(
                  w.x,
                  w.y,
                  direction.isHorizontal(),
                  Tile.fromString(anagram)
                );
                const score = board.scoreMove(move);
                if (score > bestScore) {
                  bestScore = score;
                  bestMove = move;
                }
              }
            }
          }
        }
      }
    }

    if (bestScore > 0) {
      return bestMove;
    }
  }

  playMove(board: Board, move: Move): void {
    const score = board.scoreMove(move);
    board.playMove(move);
    this.score += score;
  }
}
