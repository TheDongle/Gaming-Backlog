import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import session from "express-session";
import request from "supertest";
import { AddNewUserToDB } from "./users_middlewear/create.mjs";
import { connectionFactory } from "../db/index.mjs";

const _get = request(app).get;
const _post = request(app).post;
const _patch = request(app).patch;
const _delete = request(app).delete;

describe.each([
  { verb: "get", fn: _get, route: "/" },
  { verb: "get", fn: _get, route: "/new" },
])("Users Router", ({ verb, fn, route }) => {
  test(`${verb} ${route} should respond to HTTP requests`, async () => {
    const response = await fn(route);
    expect(response.statusCode).toBeLessThan(400);
  });
});

describe.each([
  { verb: "post", fn: _post, route: "/" },
  { verb: "delete", fn: _delete, route: "/" },
  { verb: "post", fn: _post, route: "/new" },
  { verb: "get", fn: _get, route: "/details" },
  { verb: "patch", fn: _patch, route: "/details" },
])("Users Router", ({ verb, fn, route }) => {
  test(`${verb} ${route} should block empty requests`, async () => {
    const response = await fn(route);
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe("When logged In", () => {
  let conn, TestUser, params, createdUser, id;
  beforeAll(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
    params = { username: "crabbyFace400", password: "passy1234", playStyle: "casual" };
    createdUser = await AddNewUserToDB(TestUser, params);
    id = createdUser._id;
  });
  afterAll(async () => {
    if (createdUser !== undefined) {
      await TestUser.deleteOne({ _id: createdUser._id });
    }
    await conn.close();
  });
  test("Should actually delete", () => {
    jest.mock("express-session", () => ({
      default: (options) => (req, res, next) => {
        req.user = id;
        next();
      },
    }));
    request(app).delete("/").expect(200);
  });
});
