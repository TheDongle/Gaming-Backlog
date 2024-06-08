import { passwordValidation } from "../db/validation.mjs";
import { usernameValidation } from "../db/validation.mjs";

const defaultLocals = {
  username: "",
  games: [],
  playStyle: "",
  registered: false,
  loggedIn: false,
  usernameValidation: usernameValidation,
  passwordValidation: passwordValidation,
};

const activeLocals = (dbUser) => ({
  username: dbUser.username,
  games: dbUser.games,
  playStyle: dbUser.playStyle,
  registered: dbUser.username !== "guest",
  loggedIn: true,
  usernameValidation: usernameValidation,
  passwordValidation: passwordValidation,
});

const defaultSession = {
  user: "",
  loggedIn: false,
  registered: false,
};

const activeSession = (dbUser) => ({
  user: dbUser._id,
  loggedIn: true,
  registered: dbUser.username !== "guest",
});

async function syncData(req, res, next) {
  try {
    //Always make path accessible to view engine
    req.app.locals.path = req.path;
    //Check if we have a valid user stored in session
    const db = req.app.get("db");
    const id = req.session.user ?? "";
    let dbUser = {};
    if (id !== "") {
      dbUser = await db.find(id);
    }
    let sessionSettings, localSettings;
    if (Object.entries(dbUser).length === 0) {
      sessionSettings = defaultSession;
      localSettings = defaultLocals;
    } else {
      sessionSettings = activeSession(dbUser);
      localSettings = activeLocals(dbUser);
    }
    // Apply Settings
    req.session.user = sessionSettings.user;
    req.session.loggedIn = sessionSettings.loggedIn;
    req.session.registered = sessionSettings.registered;

    req.app.locals.username = localSettings.username;
    req.app.locals.games = localSettings.games;
    req.app.locals.playStyle = localSettings.playStyle;
    req.app.locals.loggedIn = localSettings.loggedIn;
    req.app.locals.registered = localSettings.registered;
    req.app.locals.passwordValidation = localSettings.passwordValidation;
    req.app.locals.usernameValidation = localSettings.usernameValidation;
    next();
  } catch (err) {
    next(err);
  }
}

export { syncData };
