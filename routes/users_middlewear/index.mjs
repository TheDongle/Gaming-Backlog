const skipLogin = async function (req, res, next) {
  if (Object.hasOwn(req.session, "user")) {
    req.app.locals.loggedIn = true;
    req.app.locals.registered = !req.session.isGuest;
    if (req.app.locals.registered) {
      res.redirect("/games");
    } else {
      next();
    }
  } else {
    next();
  }
};

const loginPage = async function (req, res, next) {
  res.render("users/index", { isGuest: req.isGuest, id: req.id }, async (err, html) => {
    if (err) {
      next(err);
    } else {
      res.send(html);
    }
  });
};

export { skipLogin, loginPage };
