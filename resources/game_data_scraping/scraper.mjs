import { env } from "node:process";
import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

async function scrapeSite(url) {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-skip-list",
      "--disable-dev-shm-usage",
    ],
    headless: "shell",
    executablePath: env.NODE_ENV === "production" ? "/usr/bin/google-chrome" : executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.content();
  await browser.close();
  return data;
}

async function getTitleDate(data, title) {
  let reg = RegExp(`(?<=>)${title}.+?(?=<\/)`, "vi");
  let foundTitle = reg.exec(data);
  if (foundTitle === null) return { title: title };
  let year = foundTitle[0].match(/\([0-9]{4}\)/v);
  return { title: year !== null ? (title += " " + year) : title };
}

async function getTimes(data) {
  const matches = data.match(/(?<=>)\d{1,5}(?=.? Hours)(?! Hours Ago)/g);
  const truncated =
    matches !== null
      ? matches.filter((_, i) => i < 4).sort((a, b) => Number(a) - Number(b))
      : Array(4).fill("0");
  if (truncated.length < 4) {
    return {
      standardLength: Math.min(...truncated),
      completionist: Math.max(...truncated),
    };
  }
  return {
    standardLength: parseInt(truncated.at(1)),
    completionist: parseInt(truncated.at(-1)),
  };
}

async function getGameData(url, title) {
  let data = await scrapeSite(url);
  let [datedTitle, times] = await Promise.all([getTitleDate(data, title), getTimes(data)]);
  return Object.assign({}, datedTitle, times);
}

export { scrapeSite, getTimes, getTitleDate, getGameData };
