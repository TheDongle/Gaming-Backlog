import { passwordValidation } from "../db/validation.mjs";
import { usernameValidation } from "../db/validation.mjs";
import { strict as assert } from "node:assert";

const localSettings = (dbUser) => ({
  username: dbUser ? dbUser.username : "",
  games: dbUser ? dbUser.games : [],
  playStyle: dbUser ? dbUser.playStyle : "",
  loggedIn: dbUser !== null && dbUser !== undefined,
  registered: dbUser ? dbUser.username !== "guest" : false,
  usernameValidation: usernameValidation,
  passwordValidation: passwordValidation,
});

async function syncData(req, res, next) {
  try {
    //Check if we have a valid user stored in session
    const db = req.app.get("db");
    const id = req.session.user ?? "";
    const dbUser = id !== "" ? await db.find(id) : null;
    // Set locals
    const settings = localSettings(dbUser);
    for (let [key, val] of Object.entries(settings)) {
      req.app.locals[key] = val;
    }
    req.session.loggedIn = req.app.locals.loggedIn;
    req.session.registered = req.app.locals.registered;
    next();
  } catch (err) {
    next(err);
  }
}

async function addPath(req, res, next) {
  try {
    req.app.locals.path = req.path;
    next();
  } catch (err) {
    next(err);
  }
}

// async function CheckSync(req, res, next) {
//   try {
//     if (!("games" in req.app.locals)) {
//       syncData(req, res, next);
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// }

export { syncData, localSettings, addPath  };
