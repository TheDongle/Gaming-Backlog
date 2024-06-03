import express from "express";
const router = express.Router();
import { RouteMap } from "../resources/route-map.mjs";
import { setPageView, showGames } from "./games_middlewear/index.mjs";
import { setTableView } from "./games_middlewear/reset.mjs";
import { searchforGame } from "./games_middlewear/_new.mjs";
import { createGame } from "./games_middlewear/create.mjs";
import { destroyGame } from "./games_middlewear/destroy.mjs";
import { ifReqNotEmpty } from "../resources/session/borderControl.mjs";

const routeMap = new RouteMap();
routeMap.secureRoutes = {
  ShowPage: [setPageView, showGames],
  Search: [searchforGame],
  Create: [createGame],
  Destroy: [destroyGame],
};
routeMap.addCommonPrefix(["Create", "Destroy"], [ifReqNotEmpty]);
routeMap.addCommonSuffix(["Create", "Destroy"], [setTableView, showGames]);

router.get("/", routeMap.get("ShowPage"));
router.get("/new", routeMap.get("Search"));
router.post("/", routeMap.get("Create"));
router.delete("/:title", routeMap.get("Destroy"));

export { router };

