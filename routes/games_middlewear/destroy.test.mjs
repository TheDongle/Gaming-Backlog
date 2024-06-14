import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import { default as MakeRouter } from "../games.mjs";

const exampleGames = [
  { title: "g1", standardLength: 1, completionist: 2 },
  { title: "g2", standardLength: 3, completionist: 4 },
  { title: "g3", standardLength: 5, completionist: 6 },
];
const user = {
  _id: 333,
  username: "T",
  games: exampleGames,
  playStyle: "casual",
};
const locals = jest.fn(() => ({ ...user, loggedIn: true, registered: true }));
const removeGame = jest.fn(() => ({
  games: exampleGames.filter((val, ind) => ind > 0),
}));
const fakeID = 62;
const db = { model: "", removeGame };
const session = jest.fn((options) => (req, res, next) => {
  req.session = {
    user: fakeID,
    loggedIn: true,
    registered: true,
  };
  next();
});

describe("Empty request", () => {
  let app, response;
  beforeAll(async () => {
    app = MakeApp({ db, sessionObj: session, cookieStore: {} });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).delete("/games/t");
  });
  it("Should return 400", async () => {
    expect(response.statusCode).toBe(400);
  });
});

describe("Valid request", () => {
  let app, response;
  const fakeTitle = "Hi";
  beforeAll(async () => {
    app = MakeApp({ db, sessionObj: session, cookieStore: {} });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).delete("/games/t").field("title", fakeTitle);
  });
  it("Should return 200", () => {
    expect(response.statusCode).toBe(200);
  });
  it("Should call removeGame Fn", () => {
    expect(removeGame).toBeCalledWith(fakeID, fakeTitle);
  });
  it("Should update locals with info returned from removeGame Fn", () => {
    expect(locals.games).toEqual(removeGame.mock.results[0].value.games);
  });
});
