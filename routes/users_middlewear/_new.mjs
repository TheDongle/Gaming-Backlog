class Newbie {
  constructor() {
    this.route = [this._new];
  }
  async _new(req, res, next) {
    try {
      res.render("users/register", async (_, html) => {
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default function () {
  const _new = new Newbie();
  return _new.route;
}
