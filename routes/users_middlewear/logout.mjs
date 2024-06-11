import createError from "http-errors";
import { strict as assert } from "node:assert";

async function destroySession(req, res, next) {
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

async function congrats(req, res, next) {
  try {
    res.status(205).send("Logged out successfully");
  } catch (err) {
    next(err);
  }
}

class LogOut {
  constructor(verifyFn, syncFn) {
    this.verifyFn = verifyFn;
    this.syncFn = syncFn;
    this.route = [verifyFn, destroySession, syncFn, congrats];
  }
}

export default function (verifyFn, syncFn) {
  const logout = new LogOut(verifyFn, syncFn);
  return logout.route;
}
