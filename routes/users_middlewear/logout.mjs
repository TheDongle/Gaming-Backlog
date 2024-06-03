import createError from "http-errors";

async function destroySession(req, res, next) {
  try {
    req.app.locals.loggedIn = false;
    req.app.locals.registered = false;
    req.session.destroy(() => {
      res.send("/");
    });
  } catch (err) {
    next(err);
  }
}

export { destroySession };
