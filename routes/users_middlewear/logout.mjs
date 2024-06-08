import createError from "http-errors";

async function destroySession(req, res, next) {
  try {
    req.session.destroy(
      (req.sessionID,
      (err) => {
        if (err) throw createError(500, err.message);
        res.send("/");
      }),
    );
  } catch (err) {
    next(err);
  }
}

export { destroySession };
