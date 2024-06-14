import { SearchPrototype } from "./searchApi.mjs";
const searchEngine = new SearchPrototype()
import { json } from "express";
import { expect, jest, test } from "@jest/globals";
import { default as spellingResponse } from "./responseExamples/spellingIncluded.json";

describe("SearchEngine Structure", () => {
  test("SearchEngine should be Object", () => {
    expect(typeof searchEngine).toBe("object");
  });
  test("static properties should be unreachable", () => {
    ["key", "cx", "uri"].forEach((prop) => expect(Object.hasOwn(searchEngine, prop)).toBe(false));
  });
  test("static method should be unreachable", () => {
    expect(Object.hasOwn(searchEngine, "prefix")).toBe(false);
  });
});

describe.each([
  { valid: 2, badType: "1", expected: 2 },
  { valid: 6, badType: {}, expected: 6 },
  { valid: 9, badType: [], expected: 9 },
  { valid: 1, badType: null, expected: 1 },
])("'searchEngine.quantity' setter + getter", ({ valid, badType, expected }) => {
  test(`quantity should be set to ${valid}`, () => {
    searchEngine.quantity = valid;
    expect(searchEngine.quantity).toBe(expected);
  });
  test(`quantity should always be a number`, () => {
    searchEngine.quantity = badType;
    expect(typeof searchEngine.quantity).toBe("number");
  });
  test(`quantity should be unchanged by invalid types`, () => {
    expect(searchEngine.quantity).toBe(expected);
  });
});
test.each([11, Infinity])("Values above 10 should set quantity to 10", (val) => {
  searchEngine.quantity = val;
  expect(searchEngine.quantity).toBe(10);
});
test.each([0, -1])("Values below 1 should set quantity to 1", (val) => {
  searchEngine.quantity = val;
  expect(searchEngine.quantity).toBe(1);
});

// const okQuery = "devil+may+cry";
// const badSpelling = "logond+of+zold";
// const poorlyEncoded = "Kingdom Hearts HD 2.8 Final Chapter Prologue";
// const oddCharacter = "ŌKAMI";
// const outOfRange = ["", "this+is+exactly+33+characters+now"];
// const badType = [20, null, {}, []];

// import { default as validResponse } from "./responseExamples/validResponse.json";
// describe("SearchResults", () => {
//   test("searchResults should call fetch", () => {
//     const mock = jest
//       .spyOn(global, "fetch")
//       .mockImplementation(() =>
//         Promise.resolve({ json: () => Promise.resolve(validResponse) }),
//       );
//     const results = searchEngine.callAPI("devil+may+cry");
//     expect(mock).toHaveBeenCalled();
//   });
// });

import { default as withItems } from "./responseExamples/items.json";
describe("arrangeResults method", () => {
  let expected = { title: "Dark Souls", link: "https://howlongtobeat.com/game/2224", quantity: 5 };
  searchEngine.quantity = expected.quantity;
  const arranged = searchEngine.arrangeResults(withItems);
  test("results should be an object", () => {
    expect(typeof arranged).toBe("object");
  });
  test("results should contain array of titles", () => {
    expect(arranged).toHaveProperty("titles");
    expect(Array.isArray(arranged.titles)).toBeTruthy();
  });
  test("results should contain array of links", () => {
    expect(arranged).toHaveProperty("links");
    expect(Array.isArray(arranged.links)).toBeTruthy();
  });
  const { links, titles } = arranged;
  test("links and titles should be of equal length", () => {
    expect(titles).toHaveLength(links.length);
  });
  test("arrays should not be longer than requested quantity", () => {
    expect(titles.length).toBeLessThanOrEqual(expected.quantity);
  });
  test("arrays should contain the expected title and link", () => {
    expect(titles).toContain(expected.title)
    expect(links).toContain(expected.link)
  });
});
