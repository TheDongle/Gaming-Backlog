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

async function appendGuestGames(user, guest, guestModel){
  for (let game of guest.games) {
    await user.games.addToSet(game);
  }
  await Promise.all([user.save(), guestModel.deleteOne({ _id: guest._id })]);
}

async function userLogin(req, res, next) {
  try {
    const { User, Guest } = req.app.locals.models;
    const user = await verifyPasswordAndReturnUser(req.body, User);

    if ("user" in req.session && req.session.isGuest === true) {
      await appendGuestGames(user, await Guest.findById(req.session.user), Guest)
    }

    await req.session.regenerate((err) => {
      req.session.user = uid;
      req.session.isGuest = false;
    });

    req.app.locals.loggedIn = true;
    req.app.locals.registered = true;
    user.sid = req.session.id;
    await user.save();
    res.send("/games");
  } catch (err) {
    next(err);
  }
}

// Express Middlewear Function
export { userLogin };
// Express Unaware Function
export { verifyPasswordAndReturnUser };
