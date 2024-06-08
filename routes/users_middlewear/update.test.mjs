import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { default as MakeApp } from "../../app.mjs";


describe("Update User", () => {
  const session = jest.fn((options) => (req, res, next) => {
    req.session = { user: "1" };
    next();
  });
  const update = jest.fn((_, username) => Object.assign({ _id: "1" }, username));
  const find = jest.fn(() => ({ username: "jerry", _id: "1" }));
  const app = MakeApp(
    {
      model: "",
      find,
      update,
    },
    {},
    session,
  );
  test("update is called", async () => {
    const response = await request(app).patch("/details").field("username", "jimmy");
    expect(update.mock.calls.length).toBe(1);
  });
  test("Details are updated", async () => {
    const response = await request(app).patch("/details").field("username", "terry");
    expect(update).toHaveReturnedWith({ username: "terry", _id: "1" });
    expect(response.statusCode).toBe(200)
    expect(response.text).toEqual("Update Successful")
  });
});
