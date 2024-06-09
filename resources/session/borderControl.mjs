import createError from "http-errors";

async function ifLoggedIn(req, res, next) {
  try {
    if (!req.session.user) {
      throw createError(403, "User not logged in");
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function ifReqNotEmpty(req, res, next) {
  try {
    if (Object.keys(req.body).length === 0) {
      throw createError(403, "Request Body is empty");
    }
    next();
  } catch (err) {
    next(err);
  }
}

export { ifLoggedIn, ifReqNotEmpty };
