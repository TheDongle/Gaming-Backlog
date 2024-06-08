import createError from "http-errors";
import { passwordValidation } from "../../db/validation.mjs";
import bcrypt, { hashSync } from "bcrypt";

async function update(req, res, next) {
  try {
    const db = req.app.get("db");
    await db.update(req.session.user, req.body);
    res.send("Update Successful");
  } catch (err) {
    next(err);
  }
}

// Express Middlewear
export { update };
