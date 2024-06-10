import createError from "http-errors";

async function userLogin(req, res, next) {
  try {
    const db = app.get("db");
    db.model = "User";
    const { username, password } = req.body;
    let user = await db.verify(username, password);

    if ("user" in req.session && req.session.isGuest === true) {
      const guestID = req.session.user;
      user = await db.combine(user._id, guestID);
    }

    req.session.user = user_id;
    req.session.loggedIn = true;
    req.session.registered = true;
    
    req.app.locals.loggedIn = req.session.loggedIn;
    req.app.locals.registered = req.session.registered;

    res.send("games");
  } catch (err) {
    next(err);
  }
}

// Express Middlewear Function
export { userLogin };
