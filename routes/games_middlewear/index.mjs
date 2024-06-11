import createError from "http-errors";

class ShowOff {
  constructor(verifyFn, syncFn) {
    this.verifyFn = verifyFn;
    this.syncFn = syncFn;
    this.route = [this.verifyFn, this.syncFn, this.showGames];
  }
  async showGames(req, res, next) {
    try {
      res.render("games", (err, html) => {
        if (err) throw createError(500, err.message);
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, syncFn) {
  const show = new ShowOff(verifyFn, syncFn);
  return show.route;
}
