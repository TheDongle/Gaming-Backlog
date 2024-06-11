async function _new(req, res, next) {
  try {
    res.render("users/register", async (_, html) => {
      res.send(html);
    });
  } catch (err) {
    next(err);
  }
}

class Newbie {
  constructor() {
    this.route = [_new];
  }
}

export default function () {
  const _new = new Newbie();
  return _new.route;
}
