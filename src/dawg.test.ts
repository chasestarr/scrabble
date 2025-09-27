import { test, expect } from "bun:test";
import { Dawg } from "./dawg";

test("includesWord", () => {
  const d = new Dawg();
  d.pushWord("blip");
  d.pushWord("catnip");
  d.pushWord("cats");

  expect(d.includesWord("blip")).toBe(true);
  expect(d.includesWord("catnip")).toBe(true);
  expect(d.includesWord("cats")).toBe(true);
  expect(d.includesWord("cat")).toBe(false);
});

test("includesPrefix", () => {
  const d = new Dawg();
  d.pushWord("blip");
  d.pushWord("catnip");
  d.pushWord("cats");

  expect(d.includesPrefix("b")).toBe(true);
  expect(d.includesPrefix("bl")).toBe(true);
  expect(d.includesPrefix("bli")).toBe(true);
  expect(d.includesPrefix("blip")).toBe(true);
  expect(d.includesPrefix("c")).toBe(true);
  expect(d.includesPrefix("ca")).toBe(true);
  expect(d.includesPrefix("cat")).toBe(true);
  expect(d.includesPrefix("cats")).toBe(true);
});
