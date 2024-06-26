import express from "express";
import { syncData } from "../resources/locals.mjs";
import { redirectToHome, throwUnauthenticated } from "../resources/session/borderControl.mjs";
import { SearchPrototype } from "../resources/search/searchApi.mjs";
import { getGameData } from "../resources/game_data_scraping/scraper.mjs";
import { default as create } from "./games_middlewear/create.mjs";
import { default as index } from "./games_middlewear/index.mjs";
import { default as search } from "./games_middlewear/_new.mjs";
import { default as destroy } from "./games_middlewear/destroy.mjs";

export default function ({
  router = express.Router(),
  verifyFn = throwUnauthenticated,
  syncFn = syncData,
  redirectFn = redirectToHome,
  searchClass = SearchPrototype,
  scrapeFn = getGameData,
} = {}) {

  router.get("/", index(redirectFn, syncFn));
  router.post("/", create(verifyFn, scrapeFn));
  router.get("/new", search(verifyFn, searchClass));
  router.delete("/:title", destroy(verifyFn));

  return router;
}

