import { env } from "node:process";
import { connectionFactory } from "./index.mjs";
import { expect, jest, test } from "@jest/globals";

const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
describe("Connection Factory", () => {
  let conn;
  test("env file should contain connection details", () => {
    expect(env).toHaveProperty("mongoURI");
  });
  test("Mongo DB should connect be connected", async () => {
    conn = await connectionFactory(env.mongoURI);
    expect(states[conn.readyState]).toBe("connected");
  });
  test.each(["Guest", "User", "Game"])(`Connection should contain %p Model`, (Model) => {
    expect(conn.models).toHaveProperty(Model);
  });
  test("Mongo DB should be disconnected", async () => {
    await conn.close();
    expect(states[conn.readyState]).toBe("disconnected");
  });
});

