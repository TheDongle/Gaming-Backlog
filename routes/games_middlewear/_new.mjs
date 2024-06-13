import createError from "http-errors";

class Searcher {
  static searchFn;
  static verifyFn;
  constructor(verifyFn, searchFn) {
    Searcher.verifyFn = verifyFn;
    Searcher.searchFn = searchFn;
    this.route = [Searcher.verifyFn, Searcher.find];
  }
  static async find(req, res, next) {
    try {
      if (!Object.hasOwn(req.headers, "title")) {
        throw createError(400, "Query must include the game's title");
      }
      const { title, quantity } = req.headers;
      let { titles, links } = await Searcher.searchFn(title, parseInt(quantity));
      if (titles.length === 0 || links.length === 0) {
        throw createError(404, `No search results found for '${title}'`);
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


export default function (verifyFn, searchFn) {
  const searcher = new Searcher(verifyFn, searchFn);
  return searcher.route;
}
