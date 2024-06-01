import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import session from "express-session";
import request from "supertest";

const _get = request(app).get;
const _post = request(app).post;
const _patch = request(app).patch;
const _delete = request(app).delete;

describe.each([
  { verb: "get", fn: _get, route: "/", expected: 200 },
  { verb: "post", fn: _post, route: "/", expected: 403 },
  { verb: "delete", fn: _delete, route: "/", expected: 403 },
  { verb: "get", fn: _get, route: "/new", expected: 200 },
  { verb: "post", fn: _post, route: "/new", expected: 403 },
  { verb: "get", fn: _get, route: "/details", expected: 403 },
  { verb: "patch", fn: _patch, route: "/details", expected: 403 },
])("Users Router", ({ verb, fn, route, expected }) => {
  test(`${verb} ${route} should respond to HTTP requests`, async () => {
    const response = await fn(route);
    expect(response.statusCode).toBe(expected);
  });
});

describe("When logged In", () => {
  test("Should actually delete", () => {
    jest.mock("express-session", () => ({
      default: (options) => (req, res, next) => {
        req.user = "12345678910";
        next();
      },
    }));
    request(app).delete("/").expect(200);
  });
});
