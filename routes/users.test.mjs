import { expect, jest, test } from "@jest/globals";
import session from "express-session";
import request from "supertest";
import { default as MakeApp } from "../app.mjs";
import { freshDB } from "../db/index.mjs";
import { connectionFactory } from "../db/connection.mjs";

const app = MakeApp();

describe("Insecure Routes, body not required", () => {
  test(`GET / should return Successful`, async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(response.statusCode).toBeLessThan(300)
  });
  test(`GET /new should return Successful`, async () => {
    const response = await request(app).get("/new");
    expect(response.statusCode).toBeGreaterThanOrEqual(200)
    expect(response.statusCode).toBeLessThan(300)
  });
});

describe("Insecure Routes, body required", () => {
  test(`POST / should return Client Error`, async () => {
    const response = await request(app).post("/");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
  test(`POST /new should return Client Error`, async () => {
    const response = await request(app).post("/new");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
});

describe("Secure Routes", () => {
  test(`DELETE / should return Client Error`, async () => {
    const response = await request(app).delete("/");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
  test(`GET /details should return Client Error`, async () => {
    const response = await request(app).get("/details");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
  test(`PATCH /details should return Client Error`, async () => {
    const response = await request(app).patch("/details");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
  test(`DELETE /details should return Client Error`, async () => {
    const response = await request(app).delete("/details");
    expect(response.statusCode).toBeGreaterThanOrEqual(400)
    expect(response.statusCode).toBeLessThan(500)
  });
});


describe("Faking secure route", () => {
  let conn, TestUser, params, createdUser, id;
  jest.mock("express-session", () => ({
    default: (options) => (req, res, next) => {
      req.user = id;
      next();
    },
  }));
  beforeAll(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
    params = { username: "crabbyFace400", password: "passy1234", playStyle: "casual" };
  });
  beforeEach(async () => {
    createdUser = await TestUser.create(params)
    id = createdUser._id;
  });
  afterEach(async () => {
    if (await TestUser.exists({ _id: id })) {
      await TestUser.deleteOne({ _id: id });
    }
  });
  afterAll(async () => {
    await conn.close();
  });
  test("DELETE / Should return Successful", () => {
    request(app).delete("/").expect(200);
  });
});
