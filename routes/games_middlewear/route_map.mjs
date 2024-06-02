import { ifLoggedIn, ifReqNotEmpty } from "../../resources/session/borderControl.mjs";
import { setPageView , showGames} from "./index.mjs";
import { setTableView } from "./reset.mjs";
import { searchforGame } from "./_new.mjs";
import { createGame } from "./create.mjs";
import { destroyGame } from "./destroy.mjs";

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

function mapping(props) {
  const map = new Map();
  Object.keys(props).forEach((route) => {
    let arr = props[route].arr;
    if (props[route].bodyRequired) {
      arr.unshift(ifReqNotEmpty);
    }
    if (props[route].loginRequired) {
      arr.unshift(ifLoggedIn);
    }
    if (props[route].resetAfter) {
      arr.splice(arr.length, 0, setTableView, showGames);
    }
    map.set(route, arr);
  });
  return map;
}

const RouteMap = mapping(routeProperties);

export { RouteMap };
