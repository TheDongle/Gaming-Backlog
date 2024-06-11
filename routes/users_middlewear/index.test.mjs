import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import register from "./register.mjs";

describe("Index - Not logged in", () => {
  const locals = jest.fn().mockImplementation(() => ({ hello: "world" }));
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {
      id: 1000,
      cookie: {},
    };
    next();
  });
  const db = {
    model: "w",
    find: jest.fn(() => null),
    verify: jest.fn(),
  };
  let app, response;
  beforeAll(async () => {
    app = MakeApp(db, {}, session);
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/");
  });
  it("Should return Index", async () => {
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch("DOCTYPE html");
    expect(response.text).toMatch("login-form");
    expect(response.statusCode).toBe(200);
  });
  it("Should contain the default locals", async () => {
    expect(locals.username).toEqual("");
    expect(locals.playStyle).toEqual("");
    expect(locals.games).toEqual([]);
  });
  it("Should call Session", async () => {
    expect(session.mock.calls.length).toEqual(1);
  });
});

describe("Index - logged in", () => {
  const user = {
    username: 1,
    password: 2,
    playStyle: "casual",
    _id: 52,
    games: [{ title: "dance", standardLength: 20 }],
  };
  const locals = jest.fn().mockImplementation(() => ({ hello: "world" }));
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {
      user: 52,
      loggedIn: true,
      registered: true,
      id: 1000,
      cookie: {},
    };
    next();
  });
  const db = {
    model: "w",
    find: jest.fn(() => user),
  };
  let app, response;
  beforeAll(async () => {
    app = MakeApp(db, {}, session);
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/");
  });
  it("Should redirect to Games Index", async () => {
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/games");
  });
  it("Should contain the default locals", async () => {
    expect(locals.username).toBe(1);
    expect(locals.playStyle).toEqual("casual");
    expect(locals.games).toEqual([{ title: "dance", standardLength: 20 }]);
  });
});
