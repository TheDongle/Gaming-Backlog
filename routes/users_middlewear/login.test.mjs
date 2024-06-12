import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import createHttpError from "http-errors";

describe("Normal Login", () => {
  const user = { _id: 1, password: 2, username: 3, playstyle: 4 };
  let db, app, response;
  beforeAll(async () => {
    db = {
      model: "w",
      find: jest.fn(() => user),
      verify: jest.fn(() => user),
    };
    app = MakeApp({db, cookieStore: {}});
    response = await request(app)
      .post("/")
      .field("username", user.username)
      .field("password", user.password);
  });
  it("should be redirected to /games", async () => {
    expect(response.statusCode).toBeGreaterThanOrEqual(300);
    expect(response.statusCode).toBeLessThan(400);
    expect(response.headers.location).toMatch("./games");
  });
});

describe("Bad Login", () => {
  const user = { _id: 1, password: 2, username: 3, playstyle: 4 };
  let db, app, response;
  beforeAll(async () => {
    db = {
      model: "w",
      find: jest.fn(() => user),
      verify: jest.fn(() => {
        throw createHttpError(403, "Invalid");
      }),
    };
    app = MakeApp({db, cookieStore: {}});
    response = await request(app)
      .post("/")
      .field("username", user.username)
      .field("password", user.password);
  });
  it("should respond with error message", async () => {
    expect(response.statusCode).toBe(403);
    expect(response.text).toMatch("Invalid");
  });
});
