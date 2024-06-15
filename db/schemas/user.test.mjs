import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import { baseSchema } from "./baseUser.mjs";
import { Schema } from "mongoose";
import { connectionFactory } from "../connection.mjs";

const shortLivedSchema = new Schema();

shortLivedSchema.add(baseSchema);

shortLivedSchema.add({
  expiryCounter: {
    type: Date,
    default: Date.now(),
  },
});
shortLivedSchema.path("expiryCounter").index({ expires: 60 });

describe("idk", () => {
  let conn, user;
  beforeAll(async () => {
    conn = await connectionFactory({ ShortLived: shortLivedSchema });
    user = await conn.models["ShortLived"].create({ playStyle: "casual" });
  });
  afterAll(async () => {
    if (user && conn.models["ShortLived"].exists({ _id: user._id })) {
      conn.models["ShortLived"].deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Should have expiry", async () => {
    expect(user).toHaveProperty("expiryCounter");
  });
  test("Expiry should update after saving", async () => {
    const old = user.expiryCounter
    user.expiryCounter = new Date("01 January, 2050 00:00:00");
    const updated = await user.save();
    // console.log(old.toLocaleDateString())
    // console.log(updated.expiryCounter.toLocaleDateString())
    expect(old.valueOf()).toBeLessThan(updated.expiryCounter.valueOf());
  });
});
