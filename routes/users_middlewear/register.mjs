import createError from "http-errors";

class Register {
  constructor(SyncFn) {
    this.SyncFn = SyncFn;
    this.route = [
      this.throwIfEmpty,
      this.createGuest,
      this.createUser,
      this.SyncFn,
      this.redirectToGames,
    ];
  }
  async throwIfEmpty(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw createError(403, "Request Body is empty");
      }
      next();
    } catch (err) {
      next(err);
    }
  }
  async createGuest(req, res, next) {
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
  }
  async createUser(req, res, next) {
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
  }
  async redirectToGames(req, res, next) {
    try {
      res.redirect("./games");
    } catch (err) {
      next(err);
    }
  }
}

export default function (SyncFn) {
  const register = new Register(SyncFn);
  return register.route;
}
