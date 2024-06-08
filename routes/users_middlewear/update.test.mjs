import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";

const session = jest.fn((options) => (req, res, next) => {
  req.session = { user: "1" };
  next();
});
const startingUser = { username: "jerry", password: "kidneysStone1", _id: "1" };
const update = jest.fn((_, params) => Object.assign(startingUser, params));
const find = jest.fn(() => startingUser);
const app = MakeApp(
  {
    model: "",
    find,
    update,
  },
  {},
  session,
);

describe("Update User", () => {
  test("Details should be updated", async () => {
    const response = await request(app).patch("/details").field("username", "jimmy");
    expect(update.mock.calls.length).toBe(1);
    expect(update).toHaveReturnedWith(Object.assign(startingUser, { username: "terry" }));
  });
  test("Update should not error", async () => {
    const response = await request(app).patch("/details").field("username", "terry");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("Update Successful");
  });
  test("Appropriate details should be moved to locals", async () => {
    const response = await request(app)
      .patch("/details")
      .field("username", "jimbo")
      .field("password", "123412344s");
    expect(update).toHaveReturnedWith(
      Object.assign(startingUser, { username: "jimbo", password: "123412344s" }),
    );
    expect(app.locals.username).toEqual("jimbo");
    expect(app.locals.password).not.toBeDefined();
  });
});
