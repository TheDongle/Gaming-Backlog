import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import createHttpError from "http-errors";

describe("Logout", () => {
  const user = { _id: 999, password: 888, username: 777, playstyle: 666 };
  const destroy = jest.fn((params) => params());
  const session = jest.fn((options) => (req, res, next) => {
    req.sessionID = 20;
    req.session = {
      id: 20,
      user: 999,
      loggedIn: true,
      destroy,
    };
    next();
  });
  let db, app, response;
  beforeAll(async () => {
    db = {
      model: "w",
      find: jest.fn(() => user),
      verify: jest.fn(() => user),
    };
    app = MakeApp(db, {}, session);
    response = await request(app).delete("/");
  });
  it("should call session.destroy", () => {
    expect(destroy.mock.calls.length).toBe(1);
  });
  it("should be Successful", () => {
    expect(response.statusCode).toBeGreaterThanOrEqual(200);
    expect(response.statusCode).toBeLessThan(400);
  });
});
