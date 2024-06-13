import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import { default as MakeRouter } from "../games.mjs";

const locals = jest.fn().mockImplementation(() => ({}));
const user = {
  _id: 1,
  username: "2",
  games: [],
  playStyle: "completionist",
};
const session = jest.fn((options) => (req, res, next) => {
  req.session = {
    user: 1,
    cookie: {},
  };
  next();
});
const db = {
  model: "w",
  storeResults: jest.fn((titles, links) => ({ titles, links, _id: 1 })),
  find: jest.fn(() => user),
  verify: jest.fn(() => user),
};

describe("New game - no headers", () => {
  let app, response;
  const mockSearchy = jest.fn();
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchFn: mockSearchy }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/new");
  });
  it("Should call session", () => {
    expect(session.mock.calls.length).toBe(1);
  });
  it("Should block empty requests", () => {
    expect(response.statusCode).toBe(400);
  });
});

describe("New game - Headers", () => {
  let app, response, mockEmpty;
  beforeAll(async () => {
    mockEmpty = jest.fn(async () => ({ titles: [], links: [] }));
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchFn: mockEmpty }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/new").set("title", "Jeff");
  });
  it("Should call Search", () => {
    expect(mockEmpty.mock.calls.length).toBe(1);
    expect(mockEmpty.mock.calls[0][0]).toEqual("Jeff");
  });
  it("Should respond 404 when search comes-up empty", () => {
    expect(response.statusCode).toBe(404);
  });
});

describe("New game - Headers", () => {
  const mockSearch = jest.fn(() => ({ titles: ["Jeff Game"], links: ["jeffs_game.com"] }));
  let app, response;
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchFn: mockSearch }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/new").set("title", "Jeff");
  });
  it("Should respond 200", () => {
    expect(response.statusCode).toBe(200);
  });
  it("Should include result in the rendered page", () => {
    expect(response.text).toMatch("Jeff Game");
  });
});
