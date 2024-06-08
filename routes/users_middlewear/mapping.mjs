import { destroySession } from "./logout.mjs";
import { update } from "./update.mjs";
import { getDetails } from "./show.mjs";
import { skipLogin, loginPage } from "./index.mjs";
import { userLogin } from "./login.mjs";
import { getForm } from "./_new.mjs";
import { createGuest, createUser } from "./create.mjs";
import { ifReqNotEmpty } from "../../resources/session/borderControl.mjs";
import { RouteMap } from "../../resources/route-map.mjs";
import { deleteUser } from "./destroy.mjs";
import { setPageView, showGames } from "../games_middlewear/index.mjs";
import { syncData } from "../../resources/locals.mjs";

const usersMap = new RouteMap();

usersMap.secureRoutes = {
  Logout: [destroySession],
  UpdateDetails: [update],
  ShowDetails: [getDetails],
  Destroy: [deleteUser],
};
usersMap.insecureRoutes = {
  Index: [skipLogin, loginPage],
  Login: [userLogin],
  ShowRegisterForm: [getForm],
  Register: [createGuest, createUser],
};

usersMap.addCommonPrefix(["Login", "Register"], [ifReqNotEmpty]);
usersMap.addCommonSuffix(["Destroy"], [destroySession]);
usersMap.addCommonSuffix(["Login", "Register"], [syncData, setPageView, showGames]);

export const serve = (key) => usersMap.get(key);
