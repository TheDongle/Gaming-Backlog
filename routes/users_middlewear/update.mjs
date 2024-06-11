import createError from "http-errors";
import { passwordValidation } from "../../db/validation.mjs";
import bcrypt, { hashSync } from "bcrypt";
import { strict as assert } from "node:assert";

const update = async (req, res, next) => {
  try {
    // Update db
    const db = req.app.get("db");
    const user = await db.update(req.session.user, req.body);
    if (user === null) {
      throw createError(500, "update unsuccessful");
    }
    // Update Views
    for (let [key, val] of Object.entries(req.body)) {
      if (key === "password") continue;
      req.app.locals[key] = val;
    }
    // Success
    res.send("Update Successful");
  } catch (err) {
    next(err);
  }
};

class Update {
  constructor(verifyFn) {
    this.verifyFn = verifyFn;
    this.route = [verifyFn, update];
  }
}

export default function (verifyFn) {
  const update = new Update(verifyFn);
  return update.route;
}
