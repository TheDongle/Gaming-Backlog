import { expect, jest, test } from "@jest/globals";
import { myDB } from "./index.mjs";
import { settings } from "../resources/session/sessionSettings.mjs";
import MongoStore from "connect-mongo";

describe("Initialise DB", () => {
  let db;
  beforeAll(async () => {
    db = new myDB();
  });
  test("Should not be able to access connection before using 'connect' method", () => {
    expect(() => db.conn).toThrow();
  });
});

const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
describe("Connecting", () => {
  let db, conn;
  beforeAll(async () => {
    db = new myDB();
    conn = await db.connect();
  });
  afterAll(async () => {
    await db.disconnect();
  });
  test("DB Should be connected", () => {
    expect(states[conn.readyState]).toBe("connected");
  });
});

describe("Disconnecting", () => {
  let db, conn;
  beforeAll(async () => {
    db = new myDB();
    conn = await db.connect();
  });
  test("Should be disconnected", async () => {
    await db.disconnect();
    expect(states[conn.readyState]).toBe("disconnected");
  });
});

describe("Models", () => {
  let db, conn;
  beforeAll(async () => {
    db = new myDB();
    conn = await db.connect();
  });
  afterAll(async () => {
    await db.disconnect();
  });
  test.each(["User", "Guest", "TestUser"])("Model should set/get on valid strings", (val) => {
    db.model = val;
    expect(db.model).toEqual(val);
  });
  test("Should Error on Invalid string", () => {
    expect(() => (db.model = "Invalid")).toThrow();
  });
});
