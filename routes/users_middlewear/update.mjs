import createError from "http-errors";

async function updateDb(UserId, newDetails, model) {
  //TO Do - what about more than one update?
  const user = await model.findOneAndUpdate({ _id: UserId }, newDetails, {
    new: true,
    runValidators: !("password" in newDetails),
  });
  if (!user) {
    throw createError(500, "Could not find user's details");
  }
}

async function update(req, res, next) {
  const { User } = req.app.locals.models;
  try {
    await updateDb(req.session.user, req.body, User);
    res.send("Update Successful");
  } catch (err) {
    next(err);
  }
}

// Express Middlewear
export { update };
// Normal Function
export { updateDb };
