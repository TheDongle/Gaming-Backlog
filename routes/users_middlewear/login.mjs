import createError from "http-errors";

async function userLogin(req, res, next) {
  try {
    if (Object.keys(req.body).length === 0) {
      throw createError(403, "Request Body is empty");
    }

    const db = req.app.get("db");
    db.model = "User";
    const { username, password } = req.body;
    let user = await db.verify(username, password);

    if ("user" in req.session && req.session.isGuest) {
      const guestID = req.session.user;
      user = await db.combine(user._id, guestID);
    }
    req.session.user = user._id;
    next();
  } catch (err) {
    next(err);
  }
}

const goToGames = async (req, res, next) => {
  try {
    res.redirect("./games");
  } catch (err) {
    next(err);
  }
};

class Login {
  constructor(syncFn) {
    this.syncFn = syncFn;
    this.route = [userLogin, syncFn, goToGames];
  }
}

// Express Middlewear Function
export default function (syncFn) {
  const login = new Login(syncFn);
  return login.route
}
