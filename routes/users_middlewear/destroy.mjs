import createHttpError from "http-errors";
import { strict as assert } from "node:assert";
class AccountDestroyer {
  constructor(verifyFn) {
    this.verifyFn = verifyFn;
    this.route = [this.verifyFn, this.destroy];
  }
  async destroy(req, res, next) {
    try {
      const db = req.app.get("db");
      await db.destroy(req.session.user);
      res.redirect("logout");
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn) {
  const deleteYourAccount = new AccountDestroyer(verifyFn);
  return deleteYourAccount.route;
}
