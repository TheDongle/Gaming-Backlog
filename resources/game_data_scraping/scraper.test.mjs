import { expect, jest, test } from "@jest/globals";
import { scrapeSite, getTimes, getTitleDate, getGameData } from "./scraper.mjs";

describe("ScrapeSite", () => {
  const url = "https://howlongtobeat.com/game/11627";
  test("Page should include the phrase 'How long is", async () => {
    await expect(scrapeSite(url)).resolves.toMatch(/How long is/i);
  }, 20000);
  test("Page should include the expected game title", async () => {
    await expect(scrapeSite(url)).resolves.toMatch(/Dragon Age: Inquisition/i);
  }, 20000);
});


// describe("Page scraping", () => {
//   test.each([
//     {
//       title: "Resident Evil 4",
//       datedTitle: "Resident Evil 4 (2005)",
//       url: "https://howlongtobeat.com/game/7720",
//     },
//     {
//       title: "Resident Evil 4",
//       datedTitle: "Resident Evil 4 (2023)",
//       url: "https://howlongtobeat.com/game/108881",
//     },
//     {
//       title: "Doom",
//       datedTitle: "Doom (2016)",
//       url: "https://howlongtobeat.com/game/2708",
//     },
//     {
//       title: "Doom",
//       datedTitle: "Doom (1993)",
//       url: "https://howlongtobeat.com/game/2701",
//     },
//   ])("Should add dates to remade titles", async (title, datedTitle, url) => {
//     await expect(getTitleDate(await scrapeSite(), title)).resolves.toBe(datedTitle);
//   });
// });
