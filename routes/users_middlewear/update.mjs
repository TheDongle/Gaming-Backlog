import createError from "http-errors";
import { passwordValidation } from "../../db/validation.mjs";
import bcrypt, { hashSync } from "bcrypt";

async function updateDb(UserId, newDetails, model) {
  //TO Do - what about more than one update?
  if ("password" in newDetails) {
    if (!RegExp(passwordValidation.pattern).test(newDetails.password)) {
      throw new Error(passwordValidation.message);
    }
    newDetails.password = bcrypt.hashSync(newDetails.password, 10);
  }

  const user = await model.findOneAndUpdate({ _id: UserId }, newDetails, {
    new: true,
    runValidators: true,
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
