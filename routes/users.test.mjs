import { app } from "../app.mjs";
import { expect, jest, test } from "@jest/globals";
import session from "express-session";
import request from "supertest";
import { AddNewUserToDB } from "./users_middlewear/create.mjs";
import { connectionFactory } from "../db/index.mjs";

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



// describe.each([
//   { verb: "post", fn: _post, route: "/" },
//   { verb: "post", fn: _post, route: "/new" },
//   { verb: "patch", fn: _patch, route: "/details" },
// ])("Users Router", ({ verb, fn, route }) => {
//   test(`${verb} ${route} should block empty requests`, async () => {
//     const response = await fn(route);
//     expect(response.statusCode).toBeGreaterThanOrEqual(400);
//   });
// });

// describe.each([
//   { verb: "delete", fn: _delete, route: "/" },
//   { verb: "post", fn: _post, route: "/" },
//   { verb: "delete", fn: _delete, route: "/details" },
//   { verb: "get", fn: _get, route: "/details" },
//   { verb: "patch", fn: _patch, route: "/details" },
// ])("Users Router", ({ verb, fn, route }) => {
//   test(`${verb} ${route} should block insecure requests`, async () => {
//     const response = await fn(route);
//     expect(response.statusCode).toBeGreaterThanOrEqual(400);
//   });
// });

// describe("When logged In", () => {
//   let conn, TestUser, params, createdUser, id;
//   jest.mock("express-session", () => ({
//     default: (options) => (req, res, next) => {
//       req.user = id;
//       next();
//     },
//   }));
//   beforeAll(async () => {
//     conn = await connectionFactory();
//     TestUser = conn.models.TestUser;
//     params = { username: "crabbyFace400", password: "passy1234", playStyle: "casual" };
//   });
//   beforeEach(async () => {
//     createdUser = await AddNewUserToDB(TestUser, params);
//     id = createdUser._id;
//   });
//   afterEach(async () => {
//     if (await TestUser.exists({ _id: id })) {
//       await TestUser.deleteOne({ _id: id });
//     }
//   });
//   afterAll(async () => {
//     await conn.close();
//   });
//   test("Should actually delete Session", () => {
//     request(app).delete("/").expect(200);
//   });
// });
