import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import createHttpError from "http-errors";

describe("Logout", () => {
  const locals = jest.fn().mockImplementation(() => ({ hello: "world" }));
  const user = { _id: 999, password: 888, username: 777, playstyle: 666 };
  const destroy = jest.fn((x) => x());
  const session = jest.fn((options) => (req, res, next) => {
    req.session = {
      id: 20,
      user: 999,
      destroy,
    };
    next();
  });
  const db = {
    model: "w",
    find: jest.fn(() => null),
    verify: jest.fn(() => user),
  };
  let app, response;
  beforeAll(async () => {
    app = MakeApp({ db, cookieStore: {}, sessionObj: session });
    jest.replaceProperty(app, "locals", locals);
    response = await request(app).delete("/");
  });
  it("should call session.destroy", () => {
    expect(destroy.mock.calls.length).toBe(1);
  });
  it("should reset locals", () => {
    expect(locals.username).toEqual("");
    expect(locals.games).toEqual([]);
    expect(locals.loggedIn).toBe(false);
  });
  it("Should be happy", () => {
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/./);
  });
});
