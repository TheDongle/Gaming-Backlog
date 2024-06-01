import { open } from "node:fs/promises";
import { env } from "node:process";

class SearchPrototype {
  #quant;
  constructor() {
    this.#quant = 5;
  }
  static uri = "https://customsearch.googleapis.com/customsearch/v1/";
  static key = "?key=" + env.API_KEY;
  static cx = "&cx=" + env.SEARCH_ID;
  static prefix() {
    return this.uri + this.key + this.cx;
  }
  /**
   * @param {number} num
   */
  set quantity(num) {
    if (typeof num === "number") {
      this.#quant = Math.max(Math.min(num, 10), 1);
    }
  }
  get quantity() {
    return this.#quant;
  }
  async callAPI(query) {
    if (typeof query !== "string" || query.length > 32) {
      return {};
    }
    const suffix = `&q=${query}&exactTerms=how+long+is&num=${this.#quant}`;
    const request = new Request(SearchPrototype.prefix() + suffix);
    return await (await fetch(request)).json();
  }
  async checkSpelling(response) {
    if ("spelling" in response) {
      const corrected = /.+(?= \")/.exec(response.spelling.correctedQuery);
      return corrected !== null ? await this.callAPI(corrected[0]) : {};
    }
    return response;
  }
  arrangeResults(response) {
    const titles = [];
    const links = [];
    if ("items" in response) {
      const { items } = response;
      const reg = /(?<=How long is ).+(?=\?|\.\.\.)/iv;
      for (let i = 0; i < items.length && titles.length < this.#quant; i++) {
        let matched = items[i].title.match(reg);
        if (matched === null) continue;
        titles.push(matched[0].trim());
        links.push(items[i].formattedUrl);
      }
    }
    return { titles, links };
  }
  async list(query) {
    return this.arrangeResults(await this.checkSpelling(await this.callAPI(query)));
  }
  async search(query, quantity = 5) {
    this.quantity = quantity;
    if (query.length === 0) return {};
    return await this.list(query);
  }
  async trending() {
    return await this.list("");
  }
}

const searchEngine = new SearchPrototype();

export { searchEngine };
