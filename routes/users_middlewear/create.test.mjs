import { connectionFactory } from "../../db/index.mjs";
import { createDbEntry, getGuestGames } from "./create.mjs";
import { app } from "../../app.mjs";
import request from "supertest";
import { expect, jest, test } from "@jest/globals";

test("Usernames should be Unique (for real Users)", async () => {
  const conn = await connectionFactory();
  const { User } = conn.models;
  const params = { username: "crabbyFace13", password: "passy1234", playStyle: "casual" };
  const id = await User.exists({ username: "crabbyFace13" });
  const uniqueUser = id !== null ? await User.findById(id) : await createDbEntry(User, params);
  let duplicateUser;
  try {
    params.username = uniqueUser.username;
    duplicateUser = await createDbEntry(User, params);
  } catch (err) {
  } finally {
    expect(duplicateUser).toBe(undefined);
  }
  if (duplicateUser !== undefined) {
    await User.deleteOne({ _id: duplicateUser._id });
  }
  await conn.close();
});

describe("Create User", () => {
  let conn, TestUser, params, createdUser;
  beforeEach(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
    params = { username: "crabbyFace10", password: "passy1234", playStyle: "casual" };
    createdUser = await createDbEntry(TestUser, params);
  });
  afterEach(async () => {
    if (createdUser !== undefined) {
      await TestUser.deleteOne({ _id: createdUser._id });
    }
    await conn.close();
  });
  test(`New User should be created`, async () => {
    expect(createdUser).toBeTruthy();
  });
  test(`New User contain specified parameters`, async () => {
    expect(createdUser.username).toEqual(params.username);
    expect(createdUser.playStyle).toEqual(params.playStyle);
  });
  test(`Password should be hashed`, async () => {
    expect(createdUser.password).not.toEqual(params.password);
  });
  test(`comparePassword should confirm password is correct`, async () => {
    expect(createdUser.comparePassword(params.password)).resolves.toBe(true);
  });
});

describe("Create Guest", () => {
  let conn, createdGuest, Guest;
  beforeEach(async () => {
    conn = await connectionFactory();
    Guest = conn.models.Guest;
    createdGuest = await createDbEntry(Guest);
  });
  afterEach(async () => {
    if (createdGuest !== undefined) {
      await createdGuest.deleteOne({ _id: createdGuest._id });
    }
    await conn.close();
  });
  test(`New Guest should be created`, async () => {
    expect(createdGuest).toBeTruthy();
  });
  test(`New Guest should have default parameters`, async () => {
    expect(createdGuest.username).toEqual("guest");
    expect(createdGuest.playStyle).toEqual("casual");
  });
});
