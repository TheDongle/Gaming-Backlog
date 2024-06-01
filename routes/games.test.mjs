import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import request from "supertest";

const _get = request(app).get;
const _post = request(app).post;
const _delete = request(app).delete;

describe.each([
  { verb: "get", fn: _get, route: "/" },
  { verb: "post", fn: _post, route: "/" },
  { verb: "delete", fn: _delete, route: "/:title" },
  { verb: "get", fn: _get, route: "/new" },
])("Games Router", ({ verb, fn, route }) => {
  test(`${verb} ${route} should block empty requests`, async () => {
    const response = await fn("/games" + route);
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});
