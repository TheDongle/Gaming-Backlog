import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "./app.mjs";
import { connectionFactory } from "./db/connection.mjs";

describe("App Start-up", () => {
  let app, response;
  beforeAll(async () => {
    app = MakeApp();
    response = await request(app).get("/");
  });
  test("App should be Initialised", async () => {
    expect(app).toBeDefined();
  });
  test("App should have Db", async () => {
    const db = app.get("db");
    expect(db).toBeDefined();
  });
});

describe("New session is added to store", () => {
  let app, response, startingSessionCount;
  beforeAll(async () => {
    const conn = await connectionFactory();
    const Session = conn.models["Session"];
    startingSessionCount = await Session.countDocuments({});
    await conn.close();
    app = MakeApp();
    response = await request(app).get("/");
  });
  
  test("New session has been added to store", async () => {
    const db = app.get("db");
    const Session = db.conn.models["Session"];
    const currentSessionCount = await Session.countDocuments({})
    expect(startingSessionCount).toBeLessThan(currentSessionCount)
  });
});
