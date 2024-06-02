import { expect, jest, test } from "@jest/globals";

import { ifLoggedIn, ifReqNotEmpty } from "../../resources/session/borderControl.mjs";
import { setPageView, showGames } from "./index.mjs";
import { setTableView } from "./reset.mjs";
import { searchforGame } from "./_new.mjs";
import { createGame } from "./create.mjs";
import { destroyGame } from "./destroy.mjs";
import { RouteMap, routeProperties, mapping } from "./route_map.mjs";

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