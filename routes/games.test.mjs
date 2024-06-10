import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../app.mjs";
const app = MakeApp({}, false);

const rootURL = "/games";
const _get = request(app).get;
const _post = request(app).post;
const _delete = request(app).delete;

test.each([
  { verb: "get", fn: _get, route: "/" },
  { verb: "post", fn: _post, route: "/" },
  { verb: "delete", fn: _delete, route: "/:title" },
  { verb: "get", fn: _get, route: "/new" },
])("$verb $route should not accept empty requests", async ({ verb, fn, route }) => {
  const response = await fn(rootURL + route);
  expect(response.statusCode).toBeGreaterThanOrEqual(300)
});
