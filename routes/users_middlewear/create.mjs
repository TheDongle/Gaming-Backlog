import createError from "http-errors";
import { passwordValidation } from "../../db/validation.mjs";
import bcrypt, { hashSync } from "bcrypt";

async function getGuestGames(GuestModel, GuestID) {
  const guest = await GuestModel.findById(GuestID);
  if (!guest) {
    throw createError(500, "Guest activity could not be located in database");
  }
  const { games } = guest;
  await GuestModel.deleteOne({ _id: GuestID });
  return games;
}

async function AddNewUserToDB(model, params) {
  if (!RegExp(passwordValidation.pattern).test(params.password)) {
    throw new Error(passwordValidation.message);
  }
  params.password = bcrypt.hashSync(params.password, 10);
  const user = await model.create(params);
  if (!user) {
    throw createError(500, "New user could not be saved to database");
  }
  return user;
}

async function AddNewGuestToDB(model) {
  const guest = await model.create({});
  if (!guest) {
    throw createError(500, "New guest could not be saved to database");
  }
  return guest;
}

async function createGuest(req, res, next) {
  try {
    if (req.body.username === "guest") {
      const guest = await AddNewGuestToDB(req.app.locals.models.Guest);
      await req.session.regenerate(() => {
        req.session.user = guest._id;
        req.session.isGuest = true;
      });
      req.app.locals.loggedIn = true;
      req.app.locals.registered = false;
      guest.sid = req.session.id;
      console.log(await guest.save());
      await res.send("/games");
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
    if ("user" in req.session && req.session.isGuest === true) {
      params.games = await getGuestGames(req.app.locals.models.Guest, req.session.user);
    }
    const user = await AddNewUserToDB(req.app.locals.models.User, params);

    await req.session.regenerate(() => {
      req.session.user = user._id;
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
//Express Middleware
export { createGuest, createUser };
//Express-unaware functions
export { AddNewGuestToDB, AddNewUserToDB, getGuestGames };
