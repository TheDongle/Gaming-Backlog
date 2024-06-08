import createHttpError from "http-errors";

async function setTableView(req, res, next) {
  try {
    req.app.locals.gamesView = "table";
    next();
  } catch (err) {
    next(err);
  }
}

export { setTableView };
