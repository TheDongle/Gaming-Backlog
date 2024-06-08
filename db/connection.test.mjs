import { env } from "node:process";
import { connectionFactory } from "./connection.mjs";
import { expect, jest, test } from "@jest/globals";

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
