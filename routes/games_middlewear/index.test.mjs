import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";

describe("Games Index - logged in", () => {
  const locals = jest.fn().mockImplementation(() => ({ hello: "world" }));
  const user = {
    _id: 123,
    username: "Bob",
    games: [
      { title: "fight", completionist: 1 },
      { title: "drive", completionist: 2 },
      { title: "dance", completionist: 3 },
    ],
    playStyle: "completionist",
  };
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {
      user: 123,
      loggedIn: true,
      registered: true,
      id: 99999999,
      cookie: {},
    };
    next();
  });
  const db = {
    model: "w",
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  let app, response;
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/");
  });
  it("Should return Index", async () => {
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch("DOCTYPE html");
    expect(response.text).toMatch("games_table");
  });
  it("Should contain the User's details locals", async () => {
    expect(locals.username).toEqual("Bob");
    expect(locals.playStyle).toEqual("completionist");
    expect(locals.games).toEqual([
      { title: "fight", completionist: 1 },
      { title: "drive", completionist: 2 },
      { title: "dance", completionist: 3 },
    ]);
  });
  it("Should call Session", async () => {
    expect(session.mock.calls.length).toEqual(1);
  });
});

describe("Games Index - not logged in", () => {
  const locals = jest.fn().mockImplementation(() => ({ hello: "world" }));
  const user = {
    _id: 123,
    username: "Bob",
    games: [
      { title: "fight", completionist: 1 },
      { title: "drive", completionist: 2 },
      { title: "dance", completionist: 3 },
    ],
    playStyle: "completionist",
  };
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {
      id: 77,
    };
    next();
  });
  const db = {
    model: "L",
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  let app, response;
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/");
  });
  it("Should redirect to login page", async () => {
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toEqual("/");
  });
});
