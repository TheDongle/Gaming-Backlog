import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../app.mjs";
import { activeLocals, defaultLocals } from "./locals.mjs";
import session from "express-session";

describe("Sync Data - default settings", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {};
    next();
  });
  const find = jest.fn(() => ({}));
  const app = MakeApp(
    {
      model: "",
      find,
    },
    {},
    session,
  );
  let response;
  let locals;

  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  test("If this throws, session isn't equal to locals", async () => {
    expect(response.statusCode).toBe(200);
  });
  test("App should have default locals", async () => {
    for (let [key, val] of Object.entries(defaultLocals)) {
      expect(locals[key]).toEqual(val);
    }
  });
  test("addPath function", async () => {
    expect(locals.path).toEqual("/");
  });
});

describe("Sync Data - Already logged in", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = { user: "54321", id: "12344566" };
    next();
  });
  const user = { username: "ms", password: "1", _id: "54321", playStyle: "hockey" };
  const find = jest.fn(() => user);
  const app = MakeApp(
    {
      model: "",
      find,
    },
    {},
    session,
  );
  let response;
  let locals;
  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  test("If this throws, session isn't equal to locals", async () => {
    expect(response.statusCode).toBeLessThan(400);
  });
  it("Should have active locals", async () => {
    for (let [key, val] of Object.entries(activeLocals(user))) {
      expect(locals[key]).toEqual(val);
    }
  });
});
