import createError from "http-errors";

class Destroyer {
  constructor(verifyFn) {
    this.verifyFn = verifyFn;
    this.route = [this.verifyFn, this.destroyGame, this.updateTable];
  }
  async destroyGame(req, res, next) {
    try {
      // Check request is valid construct
      if (!("title" in req.body) || req.body.title.length === 0) {
        throw createError(400, "Game title not provided");
      }
      // Update db & Views
      const { title } = req.body;
      const db = req.app.get("db");
      const user = await db.removeGame(req.session.user, title);
      req.app.locals.games = user.games;
      next();
    } catch (err) {
      next(err);
    }
  }
  async updateTable(req, res, next) {
    try {
      res.render("games/components/table", (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn) {
  const destroy = new Destroyer(verifyFn);
  return destroy.route;
}
