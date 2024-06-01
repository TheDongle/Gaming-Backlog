import { searchEngine } from "../searchApi.mjs";
import * as fs from "node:fs/promises";

// async function write() {
//   try {
//     searchEngine.quantity = 10;
//     const content = await searchEngine.callAPI("dark+souls");
//     await fs.writeFile("./items.txt", JSON.stringify(await content));
//     console.log("successfully wrote file");
//   } catch (error) {
//     console.error("Failed to write file:", error.message);
//   }
// }
// await write();
