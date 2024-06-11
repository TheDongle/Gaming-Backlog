import createError from "http-errors";
import { strict as assert } from "node:assert";
class SessionDestroyer {
  constructor(verifyFn, syncFn) {
    this.verifyFn = verifyFn;
    this.syncFn = syncFn;
    this.route = [this.verifyFn, this.destroySession, this.syncFn, this.congrats];
  }
  async destroySession(req, res, next) {
    try {
      req.session.destroy(
        (req.sessionID,
        (err) => {
          if (err) throw createError(500, err.message);
        }),
      );
      next();
    } catch (err) {
      next(err);
    }
  }
  async congrats(req, res, next) {
    try {
      res.status(205).send("Logged out successfully");
    } catch (err) {
      next(err);
    }
  }
}

export default function (verifyFn, syncFn) {
  const logout = new SessionDestroyer(verifyFn, syncFn);
  return logout.route;
}
