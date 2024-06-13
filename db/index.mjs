import createHttpError from "http-errors";
import { connectionFactory } from "./connection.mjs";
import assert from "node:assert";
import {
  reconcileGames,
  createGame,
  deleteGame,
  saveResults,
  getResults,
} from "./methods/game_methods.mjs";
import {
  createEntry,
  updateEntry,
  deleteEntry,
  verifyPassword,
  findModel,
} from "./methods/user_methods.mjs";

class myDB {
  #model;
  #conn;
  #connect;
  constructor(connectFn = connectionFactory) {
    this.#connect = connectFn;
    this.#conn = {};
    this.#model = "";
  }
  get conn() {
    assert(Object.keys(this.#conn).length > 0, createHttpError(500, "not connected to DB"));
    return this.#conn;
  }
  get model() {
    return this.#model;
  }
  set model(modelName) {
    assert(modelName in this.conn.models, "invalid model name provided");
    this.#model = modelName;
  }
  async connect() {
    this.#conn = await this.#connect();
    return this.#conn;
  }
  async find(id) {
    if (this.model === "") {
      let found = await findModel(id, this.conn.models);
      if (found === "") return {};
      this.model = found;
    }
    return await this.conn.models[this.model].findById(id);
  }
  async create(userDetails) {
    return await createEntry(this.conn.models[this.model], userDetails);
  }
  async update(id, newDetails) {
    return await updateEntry(this.conn.models[this.model], id, newDetails);
  }
  async destroy(id) {
    return await deleteEntry(this.conn.models[this.model], id);
  }
  async verify(username, password) {
    return await verifyPassword(this.conn.models[this.model], username, password);
  }
  async combine(userID, guestID) {
    let { User, Guest } = this.conn.models;
    return await reconcileGames(User, userID, Guest, guestID);
  }
  async addGame(id, gameDetails) {
    const Game = this.conn.models["Game"];
    return await createGame(this.conn.models[this.model], id, new Game(gameDetails));
  }
  async removeGame(id, gameTitle) {
    return await deleteGame(this.conn.models[this.model], id, gameTitle);
  }
  async storeResults(titles, links) {
    return await saveResults(this.conn.models["SearchResults"], titles, links);
  }
  async findResults(id, index) {
    return await getResults(this.conn.models["SearchResults"], id, index);
  }
  async disconnect() {
    return await this.conn.close();
  }
}

async function freshDB() {
  const db = new myDB();
  await db.connect();
  return db;
}

export { myDB, freshDB };
