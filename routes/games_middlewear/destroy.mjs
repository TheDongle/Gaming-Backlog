import createError from "http-errors";

const destroyGame = async function (req, res, next) {
  try {
    const { title } = req.body;
    // Update db
    const db = req.app.get("db");
    const user = await db.removeGame(req.session.user, title);
    // Update Views
    req.app.locals._games = user.games;
    next();
  } catch (err) {
    next(err);
  }
};

export { destroyGame };
