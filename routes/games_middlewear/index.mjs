import createError from "http-errors";

const setPageView = async function (req, res, next) {
  try {
    req.session.gamesView = "games";
    next();
  } catch (err) {
    next(err);
  }
};

const showGames = async function (req, res, next) {
  try {
    let view = req.session.gamesView;
    const { User, Guest } = req.app.locals.models;
    let currentUser = req.session.isGuest
      ? await Guest.findById(req.session.user)
      : await User.findById(req.session.user);
    res.render(
      view,
      {
        username: currentUser.username,
        loggedGames: currentUser.games,
        playStyle: currentUser.playStyle,
        isGuest: req.session.isGuest,
        id: req.session.user,
      },
      async (err, html) => {
        if (err) next(err);
        res.send(html);
      },
    );
  } catch (err) {
    next(err);
  }
};

export { setPageView, showGames };
