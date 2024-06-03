import { ifReqNotEmpty, ifLoggedIn } from "../resources/session/borderControl.mjs";
import express from "express";
const router = express.Router();

import { skipLogin, loginPage } from "./users_middlewear/index.mjs";
import { userLogin } from "./users_middlewear/login.mjs";
import { destroySession } from "./users_middlewear/logout.mjs";
import { getForm } from "./users_middlewear/_new.mjs";
import { createUser, createGuest } from "./users_middlewear/create.mjs";
import { update } from "./users_middlewear/update.mjs";
import { getDetails } from "./users_middlewear/show.mjs";
import { RouteMap } from "../resources/route-map.mjs";

const routeMap = new RouteMap();
routeMap.secureRoutes = {
  Logout: [destroySession],
  UpdateDetails: [update],
  ShowDetails: [getDetails],
};
routeMap.insecureRoutes = {
  Index: [skipLogin, loginPage],
  Login: [userLogin],
  ShowRegisterForm: [getForm],
  Register: [createGuest, createUser],
};
routeMap.addCommonPrefix(["Login", "Register"], [ifReqNotEmpty]);

router.get("/", routeMap.get("Index"));
router.post("/", routeMap.get("Login"));
router.delete("/", routeMap.get("Logout"));
router.get("/new", routeMap.get("ShowRegisterForm"));
router.post("/new", routeMap.get("Register"));
router.patch("/details", routeMap.get("UpdateDetails"));
router.get("/details", routeMap.get("ShowDetails"));

export { router };

