import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";

describe("Index", () => {
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
