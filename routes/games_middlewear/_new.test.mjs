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
  const mock = jest.fn().mockImplementation(() => ({ search: jest.fn() }));
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchClass: mock }),
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

describe("New game - Empty Search", () => {
  let app, response;
  const empty = jest.fn(() => ({ titles: [], links: [] }));
  const mockClass = jest.fn().mockImplementation(() => {
    return { search: empty };
  });
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchClass: mockClass }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/new").set("title", "Jeff").set("quantity", "6");
  });
  it("Should call search with expected arguments", () => {
    expect(empty.mock.calls.length).toBe(1);
    expect(empty.mock.calls[0][0]).toEqual("Jeff");
    expect(empty.mock.calls[0][1]).toBe(6);
  });
  it("should give 404 for an empty search", () => {
    expect(response.statusCode).toBe(404);
  });
});

describe.each([{}, null, undefined, [], "1"])("New game - Invalid results", (invalid) => {
  let app, response;
  const mockClass = jest.fn().mockImplementation(() => {
    return { search: () => invalid };
  });
  beforeEach(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchClass: mockClass }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).get("/games/new").set("title", "Jeff").set("quantity", "6");
  });
  test(`should throw 404 when search returns ${invalid}`, async () => {
    expect(response.statusCode).toBe(404);
  });
});

describe("New game - Headers", () => {
  let app, response;
  const mockSearch = jest.fn(() => ({ titles: ["Jeff Game"], links: ["jeffs_game.com"] }));
  const mockSearchClass = jest.fn().mockImplementation(() => {
    return { search: mockSearch };
  });
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ searchClass: mockSearchClass }),
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
