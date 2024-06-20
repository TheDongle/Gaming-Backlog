import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import { default as MakeRouter } from "../games.mjs";

const locals = jest.fn().mockImplementation(() => ({ ...user, loggedIn: true, registered: true }));
const user = {
  _id: 62,
  username: "Dave",
  games: [],
  playStyle: "completionist",
};
const session = jest.fn((options) => (req, res, next) => {
  req.session = {
    user: 62,
  };
  next();
});
const example = [
  { title: "g1", link: "l1" },
  { title: "g2", link: "l2" },
  { title: "g3", link: "l3" },
];

describe("Create - no body", () => {
  let app, response;
  const db = {
    model: "eg",
    findResults: jest.fn((id, index) => example[index]),
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  const mockScrape = jest.fn();
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ scrapeFn: mockScrape }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).post("/games/");
  });
  it("Should call session", () => {
    expect(session.mock.calls.length).toBe(1);
  });
  it("Should block empty requests", () => {
    expect(response.statusCode).toBe(400);
  });
});

describe("Create - no search results", () => {
  let app, response;
  const mockScrape = jest.fn(() => ({ link: "", title: "" }));
  const db = {
    model: "eg",
    findResults: jest.fn((id, index) => null),
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ scrapeFn: mockScrape }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).post("/games/").field("resultsID", 1).field("index", 2);
  });
  it("Should Error handle deleted results", () => {
    expect(response.statusCode).toBe(410);
  });
});

describe("Create - no times", () => {
  let app, response;
  const mockScrape = jest.fn(() => ({ title: "g1", standardLength: 0, completionist: 0 }));
  const db = {
    model: "eg",
    findResults: jest.fn((id, index) => ({ title: "g1", link: "l1" })),
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ scrapeFn: mockScrape }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).post("/games/").field("resultsID", 1).field("index", 2);
  });
  it("Should return 404 for empty times", () => {
    expect(response.statusCode).toBe(404);
  });
});

describe("Create - Successful", () => {
  let app, response;
  const mockScrape = jest.fn(() => ({ title: "g2", standardLength: 1, completionist: 2 }));
  const db = {
    model: "eg",
    addGame: jest.fn((id, params) => ({ games: [params] })),
    findResults: jest.fn((id, index) => example[index]),
    find: jest.fn(() => user),
    verify: jest.fn(() => user),
  };
  beforeAll(async () => {
    app = MakeApp({
      db,
      cookieStore: {},
      sessionObj: session,
      gamesRouter: MakeRouter({ scrapeFn: mockScrape }),
    });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).post("/games/").field("resultsID", 1).field("index", 1);
  });
  it("Should be Successful", async () => {
    expect(response.statusCode).toBe(200);
  });
  it("should have correct game in locals", async () => {
    expect(locals).toHaveProperty("games", [{ title: "g2", standardLength: 1, completionist: 2 }]);
  });
});
