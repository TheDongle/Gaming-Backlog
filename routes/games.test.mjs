import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import request from "supertest";

const _get = request(app).get;
const _post = request(app).post;
const _delete = request(app).delete;

describe.each([
  { verb: "get", fn: _get, route: "/", expected: 403 },
  { verb: "post", fn: _post, route: "/", expected: 403 },
  { verb: "delete", fn: _delete, route: "/:title", expected: 403 },
  { verb: "get", fn: _get, route: "/new", expected: 403 },
])("Games Router", ({ verb, fn, route, expected }) => {
  test(`${verb} ${route} should respond to empty HTTP request with ${expected}`, async () => {
    const response = await fn("/games" + route);
    expect(response.statusCode).toBe(expected);
  });
});
