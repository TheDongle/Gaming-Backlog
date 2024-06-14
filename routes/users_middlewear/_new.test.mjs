import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";
import { default as MakeRouter } from "../games.mjs";

const db = jest.fn();
const session = jest.fn((options) => (req, res, next) => {
  next();
});

describe("_new route", () => {
  let app, response;
  beforeAll(async () => {
    app = MakeApp({ db, cookieStore: {}, sessionObj: session });
    response = await request(app).get("/new");
  });
  it("should be successful", () => {
    expect(response.statusCode).toBe(200);
  });
});
