import createHttpError from "http-errors";
import { strict as assert } from "node:assert";

async function deleteUser(req, res, next) {
  try {
    const db = req.app.get("db");
    await db.destroy(req.session.user);
    res.redirect("logout");
  } catch (err) {
    next(err);
  }
}

class DeleteAccount {
  constructor(verifyFn) {
    this.verifyFn = verifyFn;
    this.route = [verifyFn, deleteUser];
  }
}

export default function (verifyFn) {
  const deleteYourAccount = new DeleteAccount(verifyFn);
  return deleteYourAccount.route;
}
