import createError from "http-errors";

async function createGuest(req, res, next) {
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

async function createUser(req, res, next) {
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

async function toGames(req, res, next) {
  try {
    res.redirect("./games")
  } catch (err) {
    next(err);
  }
}

export { createGuest, createUser, toGames };
