import createError from "http-errors";

async function destroySession(req, res, next) {
  try {
    req.session.destroy(
      (req.sessionID,
      (err) => {
        if (err) throw createError(500, err.message);
        res.status(205).send("Logged out successfully")
      }),
    );
  } catch (err) {
    next(err);
  }
}

export { destroySession };
