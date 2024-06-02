import createHttpError from "http-errors";

async function setTableView(req, res, next) {
  try {
    req.session.gamesView = "games/components/table";
    next();
  } catch (err) {
    next(err);
  }
}

export { setTableView };
