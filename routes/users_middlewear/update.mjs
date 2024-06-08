import createError from "http-errors";
import { passwordValidation } from "../../db/validation.mjs";
import bcrypt, { hashSync } from "bcrypt";

async function update(req, res, next) {
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
}

// Express Middlewear
export { update };
