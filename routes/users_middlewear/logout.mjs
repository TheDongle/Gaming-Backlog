import createError from "http-errors";

async function destroySession(req, res, next) {
  try {
    console.log(req.session.user);
    req.app.locals.loggedIn = false;
    req.app.locals.registered = false;
    req.session.destroy(
      (req.sessionID,
      (err) => {
        if (err) throw createError(500, err.message);
        res.send("/");
      }),
    );
  } catch (err) {
    next(err);
  }
}

export { destroySession };
