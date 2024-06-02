import request from "supertest";
import { expect, jest, test } from "@jest/globals";
import { app } from "./app.mjs";

test("App Exists", () => {
  expect(app).toBeTruthy();
});
