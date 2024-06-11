import createError from "http-errors";
import asset from "node:assert/strict";
import { assert } from "node:console";

const throwIfEmpty = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw createError(403, "Request Body is empty");
    }
    next();
  } catch (err) {
    next(err);
  }
};

const createGuest = async (req, res, next) => {
  try {
    if (req.body.username === "guest") {
      const db = req.app.get("db");
      db.model = "Guest";
      const guest = await db.create({});
      req.session.user = guest._id;
    }
    next();
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    if (req.body.username !== "guest") {
      const db = req.app.get("db");

      db.model = "User";
      let user = await db.create(req.body);

      if (req.session.loggedIn && !req.session.registered) {
        const guestID = req.session.user;
        user = await db.combine(user._id, guestID);
      }
      req.session.user = user._id;
    }
    next();
  } catch (err) {
    next(err);
  }
};

const goToGames = async (req, res, next) => {
  try {
    res.redirect("./games");
  } catch (err) {
    next(err);
  }
};

class Register {
  constructor(SyncFn) {
    this.SyncFn = SyncFn;
    this.route = [throwIfEmpty, createGuest, createUser, this.SyncFn, goToGames];
  }
}

export default function (SyncFn) {
  const register = new Register(SyncFn);
  return register.route;
}
