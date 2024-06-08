import createHttpError from "http-errors";
import { passwordValidation } from "../validation.mjs";
import bcrypt, { hashSync } from "bcrypt";
import assert from "node:assert";

async function findModel(id, models) {
  for (let [modelName, model] of Object.entries(models)) {
    if (await model.exists({ _id: id })) {
      return modelName;
    }
  }
  return "";
}

async function createEntry(model, userDetails) {
  return await model.create(await validPass(userDetails));
}

async function updateEntry(model, id, newDetails) {
  return await model.findOneAndUpdate({ _id: id }, await validPass(newDetails), {
    new: true,
    runValidators: true,
  });
}

async function validPass(details) {
  if ("password" in details) {
    assert(
      RegExp(passwordValidation.pattern).test(details.password),
      createHttpError(400, passwordValidation.message),
    );
    details.password = bcrypt.hashSync(details.password, 10);
  }
  return details;
}

async function deleteEntry(model, id) {
  return await model.deleteOne({ _id: id });
}

async function verifyPassword(model, username, password) {
  const user = await model.findOne({ username });
  assert(user, createHttpError(403, "Username not recognised"));
  assert(bcrypt.compareSync(password, user.password), createHttpError(403, "Incorrect password"));
  return user;
}

export { createEntry, updateEntry, deleteEntry, verifyPassword, findModel };
