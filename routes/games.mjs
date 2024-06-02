import { ifLoggedIn, ifReqNotEmpty } from "../resources/session/borderControl.mjs";
import express from "express";
const router = express.Router();

import { setPageView, showGames } from "./games_middlewear/index.mjs";
import { setTableView } from "./games_middlewear/reset.mjs";
import { searchforGame } from "./games_middlewear/_new.mjs";
import { createGame } from "./games_middlewear/create.mjs";
import { destroyGame } from "./games_middlewear/destroy.mjs";

const routeProperties = {
  ShowPage: {
    arr: [setPageView, showGames],
    loginRequired: true,
    bodyRequired: false,
    resetAfter: false,
  },
  Search: {
    arr: [searchforGame],
    loginRequired: true,
    bodyRequired: false,
    resetAfter: false,
  },
  Create: {
    arr: [createGame],
    loginRequired: true,
    bodyRequired: true,
    resetAfter: true,
  },
  Destroy: {
    arr: [destroyGame],
    loginRequired: true,
    bodyRequired: true,
    resetAfter: true,
  },
};

const RouteMap = new Map();
Object.keys(routeProperties).forEach((route) => {
  let arr = routeProperties[route].arr;
  if (routeProperties[route].bodyRequired) {
    arr.unshift(ifReqNotEmpty);
  }
  if (routeProperties[route].loginRequired) {
    arr.unshift(ifLoggedIn);
  }
  if (routeProperties[route].resetAfter) {
    arr.splice(arr.length, 0, setTableView, showGames);
  }
  RouteMap.set(route, arr);
});

router.get("/", RouteMap.get("ShowPage"));
router.get("/new", RouteMap.get("Search"));
router.post("/", RouteMap.get("Create"));
router.delete("/:title", RouteMap.get("Destroy"));

export { router, RouteMap };

