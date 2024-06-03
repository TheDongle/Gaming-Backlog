import express from "express";
const router = express.Router();
import { serve } from "./games_middlewear/mapping.mjs";

router.get("/", serve("ShowPage"));
router.get("/new", serve("Search"));
router.post("/", serve("Create"));
router.delete("/:title", serve("Destroy"));

export { router };

