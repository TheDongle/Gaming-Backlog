import { strict as assert } from "node:assert/strict";

const skipLogin = async function (req, res, next) {
  try {
    if (req.session.registered) {
      res.redirect("/games");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const loginPage = async function (req, res, next) {
  try {
    res.render("users/index", (_, html) => {
      res.send(html);
    });
  } catch (err) {
    next(err);
  }
};

class Index {
  constructor(syncFn) {
    this.syncFn = syncFn;
    this.route = [syncFn, skipLogin, loginPage];
  }
}

export default function (syncFn) {
  const index = new Index(syncFn);
  return index.route;
}
