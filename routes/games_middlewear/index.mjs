import createError from "http-errors";

class ShowOff {
  constructor(verifyFn) {
    this.verifyFn = verifyFn;
    this.route = [this.verifyFn, this.showGames];
  }
  async showGames(req, res, next) {
    try {
      res.render("games");
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn) {
  const show = new ShowOff(verifyFn);
  return show.route;
}
