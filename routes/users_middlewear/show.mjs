class ShowUser {
  constructor(verifyFn, syncFn) {
    this.verifyFn = verifyFn;
    this.syncFn = syncFn;
    this.route = [this.verifyFn, this.syncFn, this.getDetails];
  }
  async getDetails(req, res, next) {
    try {
      res.render("users/details", (_, html) => {
        console.log(html)
        res.send(html);
      });
    } catch (err) {
      console.log(err)
      next(err);
    }
  }
}

export default function (verifyFn, syncFn) {
  const ShowDetails = new ShowUser(verifyFn, syncFn);
  return ShowDetails.route;
}
