import { getGameData } from "../../resources/game_data_scraping/scraper.mjs";
import createError from "http-errors";

class Creator {
  constructor(verifyFn, scrapeFn) {
    this.verifyFn = verifyFn;
    this.scrapeHTML = scrapeFn;
    this.route = [this.verifyFn, this.createGame, this.updateTable];
  }
  async createGame(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw createError(400, "Request Body is empty");
      }
      // Select game from search results
      const { index } = req.body;
      const [link, gameTitle] = [req.session.links[index], req.session.titles[index]];
      // Scrape additional data
      const { title, standardLength, completionist } = await this.scrapeHTML(link, gameTitle);
      // Update DB
      const db = req.app.get("db");
      const user = await db.addGame(req.session.user, { title, standardLength, completionist });
      // Update Views
      req.app.locals.games = user.games;
      next();
    } catch (err) {
      next(err);
    }
  }
  async updateTable(req, res, next) {
    try {
      res.render("/games/components/table", (_, html) => {
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
