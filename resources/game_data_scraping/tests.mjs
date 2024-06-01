import { samples as full } from "./samples.mjs";
import { getGameData } from "./scraper.mjs";
import * as assert from "node:assert/strict";

let inDepth = true;
const samples = inDepth ? full : full.filter((_, i) => i >= [full.length - 4]);
// const samples = [full.at(-1)];

async function test(samples) {
  try {
    let start = Date.now();
    for (let i = 0; i < samples.length; i++) {
      let gameData = await getGameData(samples[i].url, samples[i].title);
      console.log(gameData);
      assert.strictEqual(typeof gameData, "object");
      assert.strictEqual(typeof gameData.title, "string");
      assert.strictEqual(gameData.title, samples[i].datedTitle);
      assert.strictEqual(typeof gameData.standardLength, "number");
      assert.strictEqual(typeof gameData.completionist, "number");
      assert.ok(gameData.standardLength <= gameData.completionist);
    }
    console.log(
      `Average time = ${Math.round((Date.now() - start) / samples.length)}ms`
    );
  } catch (err) {
    console.log(err);
  }
}
await test(samples);
