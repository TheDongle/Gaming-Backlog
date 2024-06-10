import createError from "http-errors";

async function userLogin(req, res, next) {
  try {
    const db = req.app.get("db");
    db.model = "User";
    const { username, password } = req.body;
    let user = await db.verify(username, password);

    if ("user" in req.session && req.session.isGuest === true) {
      const guestID = req.session.user;
      user = await db.combine(user._id, guestID);
    }
    req.session.user = user._id;
    next()
  } catch (err) {
    next(err);
  }
}

// Express Middlewear Function
export { userLogin };
