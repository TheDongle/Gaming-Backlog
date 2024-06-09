// Command to start: nodemon --env-file=.env app.mjs -e mjs, js, html, ejs, scss, json
// Command to start: nodemon --env-file=.env server.mjs -e mjs, js, html, ejs, scss, json
import express from "express";
import logger from "morgan";
import path from "node:path";
import * as sass from "sass";
import * as fs from "node:fs";
import multer from "multer";
import { router as usersRouter } from "./routes/users.mjs";
import { router as gamesRouter } from "./routes/games.mjs";
import createError from "http-errors";
import { settings } from "./resources/session/sessionSettings.mjs";
import MongoStore from "connect-mongo";
import { addPath } from "./resources/locals.mjs";
import { freshDB } from "./db/index.mjs";
import session from "express-session";
const defaultDB = await freshDB();

/**
 *
 * @param {object} db
 * @param {*} cookieStore
 * @param {object} session
 * @returns {object} app
 */
export default function (db = defaultDB, cookieStore = MongoStore, _session = session) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  const _dirname = path.dirname("");
  app.use(express.static(path.join(_dirname, "public")));
  app.use(logger("dev"));
  app.set("view engine", "ejs");
  app.set("views", path.join(_dirname, "views"));
  console.log(app.get("views"))
  app.disable("x-powered-by");

  // Session
  if (Object.entries(session).length > 0) {
    if (Object.entries(cookieStore).length > 0) {
      settings.store = cookieStore.create(db.conn);
    }
    app.use(_session(settings));
  }
  app.set("db", db);
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

  // Keeps locals and Session data in Sync
  app.use(addPath);

  // Routers
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

