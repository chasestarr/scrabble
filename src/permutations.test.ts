import { test, expect } from "bun:test";
import { permutations, subsets, isAnagram } from "./permutations.ts";

test("permutations", () => {
  const a = permutations("pool".split(""));
  const b = permutations("start".split(""));
  const c = permutations("barter".split(""));
  expect(a.length).toBe(23);
  expect(b.length).toBe(119);
  expect(c.length).toBe(719);
});

test("subsets", () => {
  const a = subsets("dog".split(""));
  const b = subsets("pool".split(""));
  const c = subsets("start".split(""));
  const d = subsets("barter".split(""));
  expect(a).toEqual([
    ["d"],
    ["o"],
    ["d", "o"],
    ["g"],
    ["d", "g"],
    ["o", "g"],
    ["d", "o", "g"],
  ]);
  expect(b.length).toBe(15);
  expect(c.length).toBe(31);
  expect(d.length).toBe(63);
});

test("isAnagram", () => {
  expect(isAnagram("abc".split(""), "cab".split(""))).toBe(true);
  expect(isAnagram("aaa".split(""), "aaa".split(""))).toBe(true);
  expect(isAnagram("aaa".split(""), "a".split(""))).toBe(false);
  expect(isAnagram("aaa".split(""), "aaaa".split(""))).toBe(false);
});
