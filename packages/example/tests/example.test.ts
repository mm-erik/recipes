import { expect, test } from "bun:test";
import { greet } from "../index";

test("greet shouts a hello", () => {
  expect(greet("world")).toBe("HELLO, WORLD!");
});
