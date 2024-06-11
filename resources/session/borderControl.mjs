import createError from "http-errors";

async function throwUnauthenticated(req, res, next) {
  try {
    if (!req.session.user) {
      throw createError(401, "User not logged in");
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function redirectToHome(req, res, next) {
  try {
    if (!req.session.user) {
      res.set("location", "/")
      res.redirect("/")
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}


export { redirectToHome, throwUnauthenticated };
