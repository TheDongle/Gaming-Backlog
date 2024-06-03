import { destroySession } from "./logout.mjs";
import { update } from "./update.mjs";
import { getDetails } from "./show.mjs";
import { skipLogin, loginPage } from "./index.mjs";
import { userLogin } from "./login.mjs";
import { getForm } from "./_new.mjs";
import { createGuest, createUser } from "./create.mjs";
import { ifReqNotEmpty } from "../../resources/session/borderControl.mjs";
import { RouteMap } from "../../resources/route-map.mjs";

const usersMap = new RouteMap();

usersMap.secureRoutes = {
  Logout: [destroySession],
  UpdateDetails: [update],
  ShowDetails: [getDetails],
};
usersMap.insecureRoutes = {
  Index: [skipLogin, loginPage],
  Login: [userLogin],
  ShowRegisterForm: [getForm],
  Register: [createGuest, createUser],
};
usersMap.addCommonPrefix(["Login", "Register", "Logout"], [ifReqNotEmpty]);


export const serve = (key) => usersMap.get(key);