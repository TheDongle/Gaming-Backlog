// Command to start: nodemon --env-file=.env app.mjs -e mjs, js, html, ejs, scss, json
// Command to start: nodemon --env-file=.env server.mjs -e mjs, js, html, ejs, scss, json
import express from "express";
import logger from "morgan";
import path from "node:path";
import * as sass from "sass";
import * as fs from "node:fs";
import multer from "multer";
import session from "express-session";
import MongoStore from "connect-mongo";
import { settings } from "./resources/session/sessionSettings.mjs";
import { passwordValidation, usernameValidation } from "./db/validation.mjs";
import { router as usersRouter } from "./routes/users.mjs";
import { router as gamesRouter } from "./routes/games.mjs";
import createError from "http-errors";

export default function (DbConnection) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(path.dirname(""), "public")));
  app.use(logger("dev"));
  app.set("view engine", "ejs");
  app.set("views", path.join(path.dirname(""), "views"));
  app.disable("x-powered-by");

  // Data base Things
  settings.store = MongoStore.create(DbConnection);
  app.use(session(settings));
  const { User, Game, Guest } = DbConnection.models;
  app.locals.models = {
    User,
    Game,
    Guest,
  };

  // SASS
  const compressed = sass.compile("./public/stylesheets/style.scss", {
    style: "compressed",
  });
  const { css } = compressed;
  fs.writeFile("./public/stylesheets/style.css", css, (err) => {
    if (err) console.error(err);
  });

  // Parse Forms
  const upload = multer();
  app.post("*", upload.none(), (req, res, next) => next());
  app.patch("*", upload.none(), (req, res, next) => next());
  app.delete("*", upload.none(), (req, res, next) => next());

  app.locals.passwordValidation = passwordValidation;
  app.locals.usernameValidation = usernameValidation;
  app.locals.loggedIn = false;
  app.locals.registered = false;
  app.use(function addPath(req, res, next) {
    app.locals.path = req.path;
    next();
  });

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

  return app;
}

