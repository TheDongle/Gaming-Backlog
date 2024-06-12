import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../app.mjs";
import session from "express-session";
import { passwordValidation, usernameValidation } from "../db/validation.mjs";

const defaultLocals = {
  username: "",
  playStyle: "",
  games: [],
  registered: false,
  loggedIn: false,
  passwordValidation: passwordValidation,
  usernameValidation: usernameValidation,
};

describe("Sync Data - default settings", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {};
    next();
  });
  const find = jest.fn(() => null);
  const app = MakeApp({
    db: {
      model: "",
      find,
    },
    cookieStore: {},
    sessionObj: session,
  });
  let response;
  let locals;

  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  test("Session should be called", async () => {
    expect(session.mock.calls.length).toBe(1);
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
  const user = {
    username: "ms",
    password: "1",
    _id: "54321",
    playStyle: "hockey",
    games: ["hockeyGame", "hockeyGame2"],
  };
  const find = jest.fn(() => user);
  const app = MakeApp({
    db: {
      model: "",
      find,
    },
    cookieStore: {},
    sessionObj: session,
  });
  let response;
  let locals;
  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  test("Required user details are in locals", async () => {
    for (let key of ["username", "playStyle", "games"]) {
      expect(locals[key]).toEqual(user[key]);
    }
  });
  test("Secret user details are not in locals", async () => {
    for (let key of ["_id", "password"]) {
      expect(locals[key]).not.toEqual(user[key]);
    }
  });
  test("All other locals are as expected", async () => {
    expect(locals["loggedIn"]).toBe(true);
    expect(locals["registered"]).toBe(true);
    expect(locals["passwordValidation"]).toEqual(passwordValidation);
    expect(locals["usernameValidation"]).toEqual(usernameValidation);
  });
});
