import createError from "http-errors";

async function getDetails(req, res, next) {
  try {
    if (!Object.hasOwn(req.session, "user")) {
      throw createError(403, "User not logged in");
    }
    const { User, Guest } = req.app.locals.models;
    const user = req.session.isGuest
      ? await Guest.findById(req.session.user)
      : await User.findById(req.session.user);
    res.render(
      "users/details",
      { user, isGuest: req.session.isGuest, id: req.session.user },
      async (err, html) => {
        if (err) {
          next(err);
        } else {
          res.send(html);
        }
      },
    );
  } catch (err) {
    next(err);
  }
}

export { getDetails };
