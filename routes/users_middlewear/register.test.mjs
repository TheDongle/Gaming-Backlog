import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";

const create = jest.fn();
const find = jest.fn();
const app = MakeApp({
  db: {
    model: "",
    create,
    find,
  },
  cookieStore: {},
});

describe("Create User", () => {
  beforeEach(() => {
    create.mockReset();
  });
  test("Guest Create should be accepted", async () => {
    const response = await request(app).post("/new").field("username", "guest");
    expect(create.mock.calls.length).toBe(1);
    expect(create.mock.calls[0][0]).toEqual({});
  });
  test.each([
    { username: "realUserHonest1", password: "1234567829ere1", playStyle: "casual1" },
    { username: "realUserHonest2", password: "1234567829ere2", playStyle: "casual2" },
  ])("User should be created", async (params) => {
    const response = await request(app)
      .post("/new")
      .field("username", params.username)
      .field("password", params.password)
      .field("playStyle", params.playStyle);
    expect(create.mock.calls.length).toBe(1);
    expect(create.mock.calls[0][0]).toEqual(params);
  });
  test("username + playStyle should be set to locals.password + _id shouldn't", async () => {
    const params = {
      _id: "123",
      username: "realUserHonest5",
      password: "12345612465321",
      playStyle: "hardestcore",
    };
    create.mockReturnValue(params);
    find.mockReturnValue(params);
    const response = await request(app)
      .post("/new")
      .field("username", params.username)
      .field("password", params.password)
      .field("playStyle", params.playStyle);
    const { username, playStyle, password, _id } = app.locals;
    expect(username).toBe(params.username);
    expect(playStyle).toBe(params.playStyle);
    expect(password).not.toBeDefined();
    expect(_id).not.toBeDefined();
  });
  test("Should redirect to /games", async () => {
    const params = {
      _id: "123",
      username: "realUserHonest5",
      password: "12345612465321",
      playStyle: "hardestcore",
    };
    create.mockReturnValue(params);
    find.mockReturnValue(params);
    const response = await request(app)
      .post("/new")
      .field("username", params.username)
      .field("password", params.password)
      .field("playStyle", params.playStyle);
    expect(response.statusCode).toBeGreaterThanOrEqual(300);
    expect(response.statusCode).toBeLessThan(400);
    expect(response.headers.location).toMatch("./games");
  });
});
