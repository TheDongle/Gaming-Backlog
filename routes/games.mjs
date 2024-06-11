import express from "express";
const router = express.Router();
import { default as create } from "./games_middlewear/create.mjs";
import { default as index } from "./games_middlewear/index.mjs";
import { default as search } from "./games_middlewear/_new.mjs";
import { default as destroy } from "./games_middlewear/destroy.mjs";
import { redirectToHome, throwUnauthenticated } from "../resources/session/borderControl.mjs";

router.get("/", index(redirectToHome));
router.post("/", create(throwUnauthenticated));
router.get("/new", search(throwUnauthenticated));
router.delete("/:title", destroy(throwUnauthenticated));

export { router };

