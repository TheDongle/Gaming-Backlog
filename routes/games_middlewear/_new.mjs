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
      const results = await Searcher.searchClass.search(title, parseInt(quantity));
      // Test that Search results are in valid structure {links: [a,b,c], titles: [a,b,c]}
      const invalid = [
        (obj) => obj == undefined,
        (obj) => !Object.hasOwn(obj, "titles"),
        (obj) => !Object.hasOwn(obj, "links"),
        (obj) => obj.links.length === 0,
        (obj) => obj.titles.length === 0,
      ].some((fn) => fn(results));
      if (invalid) {
        throw createError(404, `Could not find search results for ${title}`);
      }
      // Attempt to save results to DB
      const db = req.app.get("db");
      const savedResults = await db.storeResults(results.titles, results.links);
      if (savedResults == undefined) {
        throw createError(500, `Failed to save search results to database'`);
      }
      res.locals.titles = savedResults.titles;
      res.locals.resultsID = savedResults._id.toString();
      res.render("games/components/results", async (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, searchClass) {
  const searcher = new Searcher(verifyFn, searchClass);
  return searcher.route;
}
