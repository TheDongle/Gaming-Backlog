import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import { name } from "ejs";
import request from "supertest";
import { RouteMap } from "./games.mjs";
import { setPageView, showGames } from "./games_middlewear/index.mjs";
import { setTableView } from "./games_middlewear/reset.mjs";
import { searchforGame } from "./games_middlewear/_new.mjs";
import { createGame } from "./games_middlewear/create.mjs";
import { destroyGame } from "./games_middlewear/destroy.mjs";
import { ifLoggedIn, ifReqNotEmpty } from "../resources/session/borderControl.mjs";

const rootURL = "/games";
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
    const response = await fn(rootURL + route);
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe.each([
  { verb: "get", fn: _get, route: "/" },
  { verb: "post", fn: _post, route: "/" },
  { verb: "delete", fn: _delete, route: "/:title" },
  { verb: "get", fn: _get, route: "/new" },
])("Games Router - without session", ({ verb, fn, route }) => {
  test(`${verb} ${route} should block empty requests`, async () => {
    const response = await fn("/games" + route);
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe.each([
  { key: "ShowPage", expected: [ifLoggedIn, setPageView, showGames] },
  { key: "Search", expected: [ifLoggedIn, searchforGame] },
  { key: "Create", expected: [ifLoggedIn, ifReqNotEmpty, createGame, setTableView, showGames] },
  { key: "Destroy", expected: [ifLoggedIn, ifReqNotEmpty, destroyGame, setTableView, showGames] },
])("Route Map", ({ key, expected }) => {
  test(`${key} should contain the functions ${expected}`, () => {
    expect(RouteMap.get(key)).toMatchObject(expected);
  });
});
