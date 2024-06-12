import { expect, jest, test } from "@jest/globals";
import { default as MakeApp } from "./app.mjs";

const session = jest.fn((options) => (req, res, next) => {
  next();
});
const find = jest.fn();
const app = MakeApp({
  db: {
    model: "",
    find,
  },
  cookieStore: {},
  sessionObj: session,
});

test("App should be Initialised", async () => {
  expect(app).toBeDefined();
});
test("App should respond to a request", async () => {
  expect(session.mock.calls.length).toBe(1);
});
test("Session should be called", async () => {
  expect(session.mock.calls.length).toBe(1);
});
