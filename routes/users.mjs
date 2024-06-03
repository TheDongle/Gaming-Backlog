import express from "express";
const router = express.Router();
import { serve } from "./users_middlewear/mapping.mjs";


router.get("/", serve("Index"));
router.post("/", serve("Login"));
router.delete("/", serve("Logout"));
router.get("/new", serve("ShowRegisterForm"));
router.post("/new", serve("Register"));
router.patch("/details", serve("UpdateDetails"));
router.get("/details", serve("ShowDetails"));

export { router };

