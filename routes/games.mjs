import express from "express";
const router = express.Router();

import { RouteMap } from "./games_middlewear/route_map.mjs";

router.get("/", RouteMap.get("ShowPage"));
router.get("/new", RouteMap.get("Search"));
router.post("/", RouteMap.get("Create"));
router.delete("/:title", RouteMap.get("Destroy"));

export { router, RouteMap };
