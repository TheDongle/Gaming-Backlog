import { getGameData } from "../../resources/game_data_scraping/scraper.mjs";
import createError from "http-errors";

const createGame = async function (req, res, next) {
  try {
    // Select game from search results
    const { index } = req.body;
    const [link, gameTitle] = [req.session.links[index], req.session.titles[index]];
    // Scrape additional data
    const { title, standardLength, completionist } = await getGameData(link, gameTitle);
    // Update DB
    const db = req.app.get("db");
    const user = await db.addGame(req.session.user, { title, standardLength, completionist });
    // Update Views
    req.app.locals._games = user.games;
    next();
  } catch (err) {
    next(err);
  }
};

export { createGame };
