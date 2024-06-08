import createHttpError from "http-errors";

async function deleteUser(req, res, next) {
  try {
    const db = req.app.get("db")
    await db.destroy(req.session.user);
    next();
  } catch (err) {
    next(err);
  }
}

export { deleteUser };
