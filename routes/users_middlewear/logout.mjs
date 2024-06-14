import createError from "http-errors";
import { strict as assert } from "node:assert";
class SessionDestroyer {
  constructor(verifyFn, syncFn) {
    this.verifyFn = verifyFn;
    this.syncFn = syncFn;
    this.route = [this.verifyFn, this.egoDeath, this.syncFn, this.destroySession];
  }
  async egoDeath(req, res, next) {
    delete req.session.user;
    next();
  }
  async destroySession(req, res, next) {
    try {
      req.session.destroy(
        (req.sessionID,
        (err) => {
          if (err) throw createError(500, err.message);
          res.status(200).send("User has been successfully logged out");
        }),
      );
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, syncFn) {
  const logout = new SessionDestroyer(verifyFn, syncFn);
  return logout.route;
}
