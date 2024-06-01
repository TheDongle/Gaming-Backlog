import createError from "http-errors";

const destroyGame = async function (req, res, next) {
  try {
    let { title } = req.body;
    const uid = req.session.user;
    const { User, Guest } = req.app.locals.models;
    const user = req.session.isGuest ? await Guest.findById(uid) : await User.findById(uid);
    user.games = user.games.filter((x) => x.title !== title);
    await user.save();
    next();
  } catch (err) {
    next(err);
  }
};

export { destroyGame };
