import createError from "http-errors";
import { searchEngine } from "../../resources/search/searchApi.mjs";

class Searcher {
  constructor(verifyFn, searchMethod) {
    this.verifyFn = verifyFn;
    this.searchMethod = searchMethod;
    this.route = [this.verifyFn, this.find];
  }
  async find(req, res, next) {
    try {
      if (!Object.hasOwn(req.headers, "title")) {
        throw createError(400, "Query must include the game's title");
      }
      const { title, quantity } = req.headers;
      let { titles, links } = await this.searchMethod(title, parseInt(quantity));
      if (titles.length === 0 || links.length === 0) {
        throw createError(400, "No results found for ");
      }
      res.locals.titles = titles;
      req.session.links = links;
      req.session.titles = titles;
      res.render("games/components/results", async (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, searchMethod = searchEngine.search) {
  const search = new Searcher(verifyFn, searchMethod);
  return search.route;
}
