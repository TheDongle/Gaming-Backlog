import createError from "http-errors";

async function getDetails(req, res, next) {
  try {
    res.render("users/details", (_, html) => {
      res.send(html);
    });
  } catch (err) {
    next(err);
  }
}

export { getDetails };
