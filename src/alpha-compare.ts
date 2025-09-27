import { Blank } from "./constants.ts";

// Blank tiles are denoted with a special character. Directly using localeCompare would
// position non-alpha earlier than alpha characters. This ensures last ordering
export function alphaCompare(a: string, b: string): number {
  if (a === Blank) {
    return 1;
  }

  if (b === Blank) {
    return -1;
  }

  return a.localeCompare(b);
}
