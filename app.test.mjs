import request from "supertest";
import { expect, jest, test } from "@jest/globals";
import { default as MakeApp } from "./app.mjs";
import { connectionFactory } from "./db/index.mjs";
const app = MakeApp(await connectionFactory());

test("App Exists", () => {
  expect(app).toBeDefined();
});
