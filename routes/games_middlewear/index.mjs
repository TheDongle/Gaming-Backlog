import createError from "http-errors";

const setPageView = async function (req, res, next) {
  try {
    req.app.locals.gamesView = "page";
    next();
  } catch (err) {
    next(err);
  }
};

const showGames = async function (req, res, next) {
  try {
    if (req.app.locals.gamesView === "page") {
      res.render("games");
    } else {
      res.render("/games/components/table", (_, html) => {
        res.send(html);
      });
    }
  } catch (err) {
    next(err);
  }
};

export { setPageView, showGames };
