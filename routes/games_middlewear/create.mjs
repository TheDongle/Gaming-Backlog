import { getGameData } from "../../resources/game_data_scraping/scraper.mjs";
import createError from "http-errors";

const createGame = async function (req, res, next) {
  try {
    let { index } = req.body;
    let { links, titles } = req.session;
    let { title, standardLength, completionist } = await getGameData(links[index], titles[index]);
    let _id = req.session.user;
    const { User, Game, Guest } = req.app.locals.models;
    const currentUser = req.session.isGuest ? await Guest.findById(_id) : await User.findById(_id);
    const currentGame = new Game({
      title,
      standardLength,
      completionist,
    });
    currentUser.games.push(currentGame);
    await currentUser.save();
  } catch (err) {
    next(err);
  }
  next();
};

export { createGame };
