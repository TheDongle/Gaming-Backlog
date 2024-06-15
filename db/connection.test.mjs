import { env } from "node:process";
import { connectionFactory } from "./connection.mjs";
import { expect, jest, test } from "@jest/globals";
import { Schema } from "mongoose";

const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
describe("Mongoose connection", () => {
  let conn;
  beforeAll(async () => {
    conn = await connectionFactory();
  });
  afterAll(async () => {
    await conn.close();
  });
  test("env file should contain connection details", () => {
    expect(env).toHaveProperty("mongoURI");
  });
  test("Mongo DB should be connected", async () => {
    expect(states[conn.readyState]).toBe("connected");
  });
  test.each(["Guest", "User", "Game"])(`Connection should contain %p Model`, (key) => {
    expect(conn.models).toHaveProperty(key);
  });
});

describe("Mongoose connection", () => {
  let conn;
  beforeAll(async () => {
    conn = await connectionFactory();
  });
  test("Should Disconnect", async () => {
    await conn.close();
    expect(states[conn.readyState]).toBe("disconnected");
  });
});

describe("Parameters", () => {
  let conn, model1, model2;
  beforeAll(async () => {
    model1 = {
      1: new Schema({
        test: String,
      }),
    };
    model2 = {
      2: new Schema({
        test: String,
      }),
    };
    conn = await connectionFactory(model1, model2);
  });
  afterAll(async () => {
    await conn.close();
  });
  test("Function should include optional models", async () => {
    expect(conn.models["1"].schema).toBeDefined()
    expect(conn.models["2"].schema).toBeDefined()
  });
});
