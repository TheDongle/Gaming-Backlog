// import { searchEngine } from "./searchApi.mjs";
// import * as assert from "node:assert/strict";
// import { quantities, queries } from "./samples.mjs";

// async function testInitialise() {
//   let privateMsg = "static properties should be unreachable";
//   console.log("testing class initialisation");
//   let start = Date.now();

//   try {
//     assert.strictEqual(typeof searchEngine, "object");
//     assert.ok(!Object.hasOwn(searchEngine, "#key"), privateMsg);
//     assert.ok(!Object.hasOwn(searchEngine, "#cx"), privateMsg);
//     assert.ok(!Object.hasOwn(searchEngine, "uri"), privateMsg);
//     console.log(`test passed in ${Date.now() - start}ms`);
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function testQuant() {
//   console.log("testing Quantity Setter");
//   let start = Date.now();
//   try {
//     for (let i = 0; i < quantities.length; i++) {
//       searchEngine.quantity = quantities[i].num;
//       assert.ok(
//         Object.hasOwn(searchEngine, "quant"),
//         "quant property not found",
//       );
//       assert.strictEqual(typeof searchEngine.quant, "number");
//       assert.ok(
//         searchEngine.quant > 0 && searchEngine.quant <= 10,
//         "quant is not between 1 and 10",
//       );
//       assert.ok(
//         quantities[i].expect(searchEngine.quant),
//         "not expected result",
//       );
//     }
//     console.log(`test passed in ${Date.now() - start}ms`);
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function testAPI() {
//   console.log("testing Google API Request");
//   let start = Date.now();
//   try {
//     for (let i = 0; i < queries.length; i++) {
//       let results = await searchEngine.getResults(queries[i].query);
//       assert.ok(queries[i].expect(results), "unexpected response to sample");
//       if (
//         typeof queries[i].query !== "string" ||
//         queries[i].query.length === 0 ||
//         queries[i].query.length > 32
//       ) {
//         assert.strictEqual(results, null, "invalid query should return null");
//       } else {
//         assert.strictEqual(typeof results, "object");
//         assert.ok(Object.hasOwn(results, "titles"), "no titles returned");
//         assert.ok(Object.hasOwn(results, "links"), "no links returned");
//         //
//         let { titles, links } = results;
//         assert.ok(Array.isArray(titles), "titles are not in an array");
//         assert.ok(Array.isArray(links), "links are not in an array");
//         assert.ok(titles.length !== 0, "titles are empty");
//         assert.ok(links.length !== 0, "links are empty");
//         assert.ok(titles.length <= searchEngine.quant, "too many titles");
//         assert.ok(links.length <= searchEngine.quant, "too many link");

//         assert.strictEqual(titles.length, links.length);
//         assert.strictEqual(typeof titles[0], "string");
//         assert.strictEqual(typeof links[0], "string");

//         titles.forEach((str) => assert.strictEqual(str, str.trim()));
//         links.forEach((str) => assert.strictEqual(str, str.trim()));
//       }
//     }
//     console.log(
//       `tests passed in average time of ${Math.floor(
//         (Date.now() - start) / queries.length,
//       )}ms`,
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }

// await testInitialise();
// await testQuant();
// await testAPI();
