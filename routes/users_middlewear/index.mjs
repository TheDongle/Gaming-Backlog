const skipLogin = async function (req, res, next) {
  try {
    if (req.session.registered === true) {
      res.redirect("/games");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const loginPage = async function (req, res, next) {
  try {
    res.render("users/index", (_, html) => {
      res.send(html);
    });
  } catch (err) {
    next(err);
  }
};

export { skipLogin, loginPage };
