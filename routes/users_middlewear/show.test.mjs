import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";

const session = jest.fn((options) => (req, res, next) => {
  req.session = { user: "1" };
  next();
});
const user = { username: "me", password: "drowssap", _id: "1", playStyle: "pew" };
const find = jest.fn(() => user);
const app = MakeApp(
  {
    model: "",
    find,
  },
  {},
  session,
);

describe("Show User Details", () => {
  let response;
  beforeEach(async () => {
    response = await request(app).get("/details");
  });
  it("should have user details in locals", async () => {
    expect(find.mock.calls.length).toBe(1);
  });
  it("should be OK", async () => {
    expect(response.statusCode).toBe(200);
  });
  it("should have appropriate user details in locals", async () => {
    for (let [key, val] in Object.entries(user)) {
      if (key !== "password" && key !== "_id") {
        expect(app.locals[key]).toBe(val);
      } else {
        expect(app.locals[key]).not.toBeDefined();
      }
    }
  });
});