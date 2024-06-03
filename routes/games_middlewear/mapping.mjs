import { RouteMap } from "../../resources/route-map.mjs";
import { setPageView, showGames } from "./index.mjs";
import { setTableView } from "./reset.mjs";
import { searchforGame } from "./_new.mjs";
import { createGame } from "./create.mjs";
import { destroyGame } from "./destroy.mjs";
import { ifReqNotEmpty } from "../../resources/session/borderControl.mjs";

const routeMap = new RouteMap();
routeMap.secureRoutes = {
  ShowPage: [setPageView, showGames],
  Search: [searchforGame],
  Create: [createGame],
  Destroy: [destroyGame],
};
routeMap.addCommonPrefix(["Create", "Destroy"], [ifReqNotEmpty]);
routeMap.addCommonSuffix(["Create", "Destroy"], [setTableView, showGames]);

export const serve = (key) => routeMap.get(key)