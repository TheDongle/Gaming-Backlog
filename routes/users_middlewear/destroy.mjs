import createHttpError from "http-errors";

async function deleteUser(req, res, next) {
  try {
    let { User } = req.app.locals.models;
    await User.deleteOne({ _id: req.session.user });
    next();
  } catch (err) {
    next(err);
  }
}

export { deleteUser };
