// Command to start: nodemon --env-file=.env app.mjs -e mjs, js, html, ejs, scss, json
// Command to start: nodemon --env-file=.env server.mjs -e mjs, js, html, ejs, scss, json
import express from "express";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

import session from "express-session";
import { settings } from "./resources/session/sessionSettings.mjs";
app.use(session(settings));

import logger from "morgan";
app.use(logger("dev"));

// Mess with this if you want styles to break
import path from "node:path";
import * as sass from "sass";
import * as fs from "node:fs";
const __dirname = path.dirname("");
app.use(express.static(path.join(__dirname, "public")));
const compressed = sass.compile("./public/stylesheets/style.scss", {
  style: "compressed",
});
const { css } = compressed;
fs.writeFile("./public/stylesheets/style.css", css, (err) => {
  if (err) console.error(err);
});

// Makes form submissions readable
import multer from "multer";
const upload = multer();
app.post("*", upload.none(), (req, res, next) => next());
app.patch("*", upload.none(), (req, res, next) => next());
app.delete("*", upload.none(), (req, res, next) => next());

// Data base connection
import { connectionFactory } from "./db/index.mjs";
const conn = await connectionFactory();
const { User, Game, Guest } = conn.models;
app.locals.models = {
  User,
  Game,
  Guest,
};

// HTML templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
import { passwordValidation, usernameValidation } from "./db/validation.mjs";
app.locals.passwordValidation = passwordValidation;
app.locals.usernameValidation = usernameValidation;
app.locals.loggedIn = false;
app.locals.registered = false;
app.use(function addPath(req, res, next) {
  app.locals.path = req.path;
  next();
});

import { router as usersRouter } from "./routes/users.mjs";
import { router as gamesRouter } from "./routes/games.mjs";
import createError from "http-errors";
app.use("/", usersRouter);
app.use("/games", gamesRouter);
app.use(function notFound(req, res, next) {
  next(createError(404));
});

app.use(function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json(err.message);
});

export { app };
