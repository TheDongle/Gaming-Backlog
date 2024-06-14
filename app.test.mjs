import { expect, jest, test } from "@jest/globals";
import { default as MakeApp } from "./app.mjs";

const session = jest.fn((options) => (req, res, next) => {
  next();
});
const find = jest.fn();
const db = {
  model: "",
  find,
};
const app = MakeApp({
  db,
  cookieStore: {},
  sessionObj: session,
});
describe("App Start-up",() => {
  test("App should be Initialised", async () => {
    expect(app).toBeDefined();
  });
  test("App should have Db", async () => {
    expect(app.get("db")).toEqual(db);
  });
  test("Session should be called", async () => {
    expect(session.mock.calls.length).toBe(1);
  });
})

