import { strict as assert } from "node:assert/strict";

class Index {
  constructor(syncFn) {
    this.syncFn = syncFn;
    this.route = [this.syncFn, this.skipLogin, this.renderHomePage];
  }
  async skipLogin(req, res, next) {
    try {
      if (req.session.registered) {
        res.redirect("/games");
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
  async renderHomePage(req, res, next) {
    try {
      res.render("users/index", (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function (syncData) {
  const index = new Index(syncData);
  return index.route;
}
