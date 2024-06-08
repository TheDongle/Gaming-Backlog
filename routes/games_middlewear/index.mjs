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
    const db = req.app.get("db");
    const user = await db.find(req.session.user);
    res.render(
      "games",
      {
        username: user.username,
        loggedGames: user.games,
        playStyle: user.playStyle,
        isGuest: req.session.isGuest,
        id: user._id,
      },
      async (_, html) => {
        res.send(html);
      },
    );
  } catch (err) {
    next(err);
  }
};

export { setPageView, showGames };
