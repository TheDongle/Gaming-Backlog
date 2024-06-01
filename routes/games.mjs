import { ifLoggedIn, ifReqNotEmpty } from "../resources/session/borderControl.mjs";
import express from "express";
const router = express.Router();

import { setPageView, setTableView, showGames } from "./games_middlewear/index.mjs";
import { searchforGame } from "./games_middlewear/_new.mjs";
import { createGame } from "./games_middlewear/create.mjs";
import { destroyGame } from "./games_middlewear/destroy.mjs";

const Show = [ifLoggedIn, setPageView, showGames];
const Search = [ifLoggedIn, searchforGame];
const Create = [ifLoggedIn, ifReqNotEmpty, createGame, setTableView, showGames];
const Destroy = [ifLoggedIn, ifReqNotEmpty, destroyGame, setTableView, showGames];

router.get("/", Show);
router.get("/new", Search);
router.post("/", Create);
router.delete("/:title", Destroy);

export { router };

