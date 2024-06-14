import { getGameData } from "../../resources/game_data_scraping/scraper.mjs";
import createError from "http-errors";

class Creator {
  static verifyFn;
  static scrapeHTML;
  constructor(verifyFn, scrapeFn) {
    Creator.verifyFn = verifyFn;
    Creator.scrapeHTML = scrapeFn;
    this.route = [Creator.verifyFn, Creator.createGame, Creator.updateTable];
  }
  static async createGame(req, res, next) {
    try {
      if (Object.keys(req.body).length < 2) {
        throw createError(400, "Request Body is empty");
      }
      // Select game from search results
      const { resultsID, index } = req.body;
      const db = req.app.get("db");
      const results = await db.findResults(resultsID, index);
      if (results === null) {
        throw createError(410, "Search results are stored for a maximum of 30 minutes.");
      }
      // Scrape additional data
      const { link, title: gameTitle } = results;
      const { title, standardLength, completionist } = await Creator.scrapeHTML(link, gameTitle);
      // Update DB
      const user = await db.addGame(req.session.user, { title, standardLength, completionist });
      // Update Views
      req.app.locals.games = user.games;
      next();
    } catch (err) {
      next(err);
    }
  }
  static async updateTable(req, res, next) {
    try {
      res.render("games/components/table", (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, scrapeFn = getGameData) {
  const create = new Creator(verifyFn, scrapeFn);
  return create.route;
}
