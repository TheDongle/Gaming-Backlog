import createError from "http-errors";

// async function getGuestGames(GuestModel, GuestID) {
//   const guest = await GuestModel.findById(GuestID);
//   if (!guest) {
//     throw createError(500, "Guest activity could not be located in database");
//   }
//   const { games } = guest;
//   await GuestModel.deleteOne({ _id: GuestID });
//   return games;
// }

// async function AddNewUserToDB(model, params) {
//   if (!RegExp(passwordValidation.pattern).test(params.password)) {
//     throw new Error(passwordValidation.message);
//   }
//   params.password = bcrypt.hashSync(params.password, 10);
//   const user = await createEntry(model, params);
//   if (!user) {
//     throw createError(500, "New user could not be saved to database");
//   }
//   return user;
// }

// async function AddNewGuestToDB(model) {
//   const guest = await createEntry(model, {});
//   if (!guest) {
//     throw createError(500, "New guest could not be saved to database");
//   }
//   return guest;
// }

async function createGuest(req, res, next) {
  try {
    if (req.body.username === "guest") {
      const db = req.app.get("db");
      db.model = "Guest";
      const guest = await db.create({});

      req.session.user = guest._id;
      req.session.loggedIn = true;
      req.session.registered = false;

      req.app.locals.loggedIn = true;
      req.app.locals.registered = false;
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    if (req.body.username !== "guest") {
      const db = req.app.get("db");

      db.model = "User";
      let user = await db.create(req.body);

      if (req.session.loggedIn && !req.session.registered) {
        const guestID = req.session.user;
        user = await db.combine(user._id, guestID);
      }

      req.session.user = user._id;
      req.session.loggedIn = true;
      req.session.registered = true;

      req.app.locals.loggedIn = true;
      req.app.locals.registered = true;
    }
    next();
  } catch (err) {
    next(err);
  }
}
//Express Middleware
export { createGuest, createUser };
// //Express-unaware functions
// export { AddNewGuestToDB, AddNewUserToDB };
