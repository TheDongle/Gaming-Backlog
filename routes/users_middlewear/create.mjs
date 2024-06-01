import createError from "http-errors";

async function getGuestGames(GuestModel, GuestID) {
  const guest = await GuestModel.findById(GuestID);
  if (!guest) {
    throw createError(500, "Guest activity could not be located in database");
  }
  const { games } = guest;
  await GuestModel.deleteOne({ _id: GuestID });
  return games;
}

async function createDbEntry(model, params) {
  const user = await model.create(params);
  if (!user) {
    throw createError(500, "New user could not be saved to database");
  }
  return user;
}

async function createGuest(req, res, next) {
  try {
    if (req.body.username === "guest") {
      const guest = await createDbEntry(req.app.locals.models.Guest);
      
      req.session.regenerate(() => {
        req.session.user = guest._id;
        req.session.isGuest = true;
        req.app.locals.loggedIn = true;
        req.app.locals.registered = false;
        req.session.save(() => {
          res.send("/games");
        });
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const params = Object.assign({}, req.body);
    if (req.session.isGuest) {
      params.games = await getGuestGames(req.app.locals.models.Guest, req.session.user);
    }
    const user = await createDbEntry(req.app.locals.models.User, params);

    req.session.regenerate(() => {
      req.session.user = user._id;
      req.session.isGuest = false;
      req.app.locals.loggedIn = true;
      req.app.locals.registered = true;
      req.session.save(() => {
        res.send("/games");
      });
    });
  } catch (err) {
    next(err);
  }
}
//Express Middleware
export { createGuest, createUser };
//Express-unaware functions
export { createDbEntry, getGuestGames };
