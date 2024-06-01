import createError from "http-errors";

async function verifyPasswordAndReturnUser(params, UserModel) {
  const { username, password } = params;
  const user = await UserModel.findOne({ username });
  if (!user) {
    throw createError(403, "Username not recognised");
  }
  if (!(await user.comparePassword(password))) {
    throw createError(403, "Incorrect Password");
  }
  return user;
}

async function userLogin(req, res, next) {
  try {
    const { User, Guest } = req.app.locals.models;
    const user = await verifyPasswordAndReturnUser(req.body, User);

    let uid = user._id;
    let gid = req.session.user ?? undefined;
    let isGuest = req.session.isGuest ?? undefined;
    if (gid && isGuest) {
      let { games: guestGames } = await Guest.findById(gid);
      let user = await User.findById(uid);
      for (let game of guestGames) {
        user.games.addToSet(game);
      }
      await user.save();
    }
    req.session.regenerate((err) => {
      if (err) next(err);
      req.session.user = uid;
      req.app.locals.loggedIn = true;
      req.app.locals.registered = true;
      req.session.isGuest = false;
      req.session.save((err) => {
        if (err) next(err);
        res.send("/games");
      });
    });
  } catch (err) {
    next(err);
  }
}

// Express Middlewear Function
export { userLogin };
// Express Unaware Function
export { verifyPasswordAndReturnUser };
