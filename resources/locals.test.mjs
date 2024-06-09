import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../app.mjs";
import { activeLocals, defaultLocals } from "./locals.mjs";

describe("Sync Data - default settings", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = { id: "54321" };
    next();
  });
  // const user = { username: "ms", password: "1", _id: "123", playStyle: "hockey" };
  const find = jest.fn(() => ({}));
  const app = MakeApp(
    {
      model: "",
      find,
    },
    {},
    session,
  );
  let response;
  let locals;
  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  it("Should have default locals", async () => {
    for (let [key, val] of Object.entries(defaultLocals)) {
      expect(locals[key]).toEqual(val);
    }
  });
});

describe("Sync Data - Already logged in", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = { user: "54321", id: "12344566" };
    next();
  });
  const user = { username: "ms", password: "1", _id: "54321", playStyle: "hockey" };
  const find = jest.fn(() => user);
  const app = MakeApp(
    {
      model: "",
      find,
    },
    {},
    session,
  );
  let response;
  let locals;
  beforeAll(async () => {
    response = await request(app).get("/");
    locals = app.locals;
  });
  it("Should have active locals", async () => {
    for (let [key, val] of Object.entries(activeLocals(user))) {
      expect(locals[key]).toEqual(val);
    }
  });
});
