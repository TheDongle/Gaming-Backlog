import express from "express";
import logger from "morgan";
import path from "node:path";
import * as fs from "node:fs";
import * as sass from "sass";
import multer from "multer";
import { addPath } from "./resources/locals.mjs";
import { syncData } from "./resources/locals.mjs";
import { router as usersRouter } from "./routes/users.mjs";
import { default as makeGamesRouter } from "./routes/games.mjs";
import createError from "http-errors";
import session from "express-session";
import { settings } from "./resources/session/sessionSettings.mjs";
import MongoStore from "connect-mongo";
import { freshDB } from "./db/index.mjs";
const myDB = await freshDB();

/**
 *
 * @param {object} db
 * @param {*} cookieStore
 * @param {object} session
 * @returns {object} app
 */
export default function ({
  app = express(),
  db = myDB,
  cookieStore = MongoStore,
  sessionObj = session,
  gamesRouter = makeGamesRouter(),
} = {}) {
  app.use(express.urlencoded({ extended: true }));
  const _dirname = path.dirname("");
  app.use(express.static(path.join(_dirname, "public")));
  app.use(logger("dev"));
  app.set("view engine", "ejs");
  app.set("views", path.join(_dirname, "views"));
  app.disable("x-powered-by");

  // Session Object
  if (cookieStore === MongoStore) {
    settings.store = cookieStore.create(db.conn);
  }
  app.use(sessionObj(settings));
  // Mongoose, usually
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

  // Makes path accessible in views
  app.use(addPath);

  // Routers
  app.use("/", usersRouter);
  app.use("/games", gamesRouter);
  app.use(function notFound(req, res, next) {
    next(createError(404));
  });

  app.use(function errorHandler(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500).json(err.message);
  });

  return app;
}

