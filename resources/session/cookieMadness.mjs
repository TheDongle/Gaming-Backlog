import createHttpError from "http-errors";

async function checkCookie(req, res, next) {
  try {
    let user;
    let { User, TestUser, Guest } = req.app.locals.models;
    for (let model of [User, Guest, TestUser]) {
      user = model.findOne({ sid: req.session.id });
      if (user) {
        break;
      }
    }
    if (!user) {
      await req.session.reload((err) => {
        if ("user" in req.session) delete req.session.user;
        if ("isGuest" in req.session) delete req.session.isGuest;
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

export { checkCookie };
