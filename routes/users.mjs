import express from "express";
const router = express.Router();
import { syncData } from "../resources/locals.mjs";
import { default as register } from "./users_middlewear/Register.mjs";
import { Home, ifLoggedIn } from "../resources/session/borderControl.mjs";
import { default as ShowRegisterForm } from "./users_middlewear/_new.mjs";
import { default as login } from "./users_middlewear/login.mjs";
import { default as index } from "./users_middlewear/index.mjs";
import { default as logout } from "./users_middlewear/logout.mjs";
import { default as update } from "./users_middlewear/update.mjs";
import { default as showDetails} from "./users_middlewear/show.mjs";
import { default as deleteAccount } from "./users_middlewear/destroy.mjs";

// Insecure Routes
router.get("/", index(syncData));
router.post("/", login(syncData));
router.post("/new", register(syncData));
router.get("/new", ShowRegisterForm());

//Secure Routes
router.delete("/", logout(Home, syncData));
router.patch("/details", update(Home));
router.get("/details", showDetails(ifLoggedIn, syncData));
router.delete("/details", deleteAccount(Home));

export { router };

