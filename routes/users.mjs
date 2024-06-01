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

const Index = [skipLogin, loginPage];
const Login = [ifReqNotEmpty, userLogin];
const Logout = [ifLoggedIn, destroySession];
const ShowRegisterForm = [getForm];
const Register = [ifReqNotEmpty, createGuest, createUser];
const UpdateDetails = [ifLoggedIn, update];
const ShowDetails = [ifLoggedIn, getDetails];

router.get("/", Index);
router.post("/", Login);
router.delete("/", Logout);
router.get("/new", ShowRegisterForm);
router.post("/new", Register);
router.patch("/details", UpdateDetails);
router.get("/details", ShowDetails);

export { router };

