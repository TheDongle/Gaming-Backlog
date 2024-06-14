import createError from "http-errors";

class Searcher {
  static searchClass;
  static verifyFn;
  constructor(verifyFn, searchClass) {
    Searcher.verifyFn = verifyFn;
    Searcher.searchClass = new searchClass();
    this.route = [Searcher.verifyFn, Searcher.find];
  }
  static async find(req, res, next) {
    try {
      if (!Object.hasOwn(req.headers, "title")) {
        throw createError(400, "Query must include the game's title");
      }
      const { title, quantity } = req.headers;
      const { titles, links } = await Searcher.searchClass.search(title, parseInt(quantity));
      if (titles.length === 0 || links.length === 0) {
        throw createError(404, `No search results found for '${title}'`);
      }
      const db = req.app.get("db");
      const savedResults = await db.storeResults(titles, links);
      res.render(
        "games/components/results",
        { titles, links, resultsID: savedResults._id },
        async (_, html) => {
          res.send(html);
        },
      );
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, searchClass) {
  const searcher = new Searcher(verifyFn, searchClass);
  return searcher.route;
}
