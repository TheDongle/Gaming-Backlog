import createError from "http-errors";

async function destroySession(req, res, next) {
  try {
    if (!Object.hasOwn(req.session, "user")) {
      throw createError(403, "User not logged in");
    }
    req.app.locals.loggedIn = false;
    req.app.locals.registered = false;
    req.session.destroy((err) => {
      if (err) next(err);
      res.send("/");
    });
  } catch (err) {
    next(err);
  }
}

export { destroySession };
