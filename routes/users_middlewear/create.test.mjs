import { connectionFactory } from "../../db/index.mjs";
import { AddNewGuestToDB, AddNewUserToDB, getGuestGames } from "./create.mjs";
import { app } from "../../app.mjs";
import request from "supertest";
import { expect, jest, test } from "@jest/globals";
import { passwordValidation } from "../../db/validation.mjs";

describe("Create User", () => {
  let conn, TestUser, createdUser;
  const params = { username: "crabbyFace10", password: "passy1234", playStyle: "casual" };
  beforeAll(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
    createdUser = await AddNewUserToDB(TestUser, params);
  });
  afterAll(async () => {
    if (createdUser !== undefined) await TestUser.deleteOne({ _id: createdUser._id });
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

describe("Create User Validation", () => {
  let conn, TestUser;
  const params = { username: "crabbyFace10", password: "passy1234", playStyle: "casual" };
  beforeAll(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
  });
  afterEach(async () => {
    const testID = await TestUser.exists({});
    if (testID !== null) {
      await TestUser.deleteOne({ _id: testID });
    }
  });
  afterAll(async () => {
    await conn.close();
  });
  test.each(["", "123", "abc", "seven12", "123456789012345678901234567890123"])(
    "Invalid password shouldn't be accepted",
    async (sample) => {
      params.password = sample;
      await expect(async () => await AddNewUserToDB(TestUser, params)).rejects.toThrow();
    },
  );
  test.each(["", "badName", "123456789012345678901234567890123", "Space Man"])(
    "Invalid Username shouldn't be accepted",
    async (sample) => {
      params.username = sample;
      await expect(async () => await AddNewUserToDB(TestUser, params)).rejects.toThrow();
    },
  );
  test("Invalid playStyle shouldn't be accepted", async () => {
    params.playStyle = "Bad";
    await expect(async () => await AddNewUserToDB(TestUser, params)).rejects.toThrow();
  });
});

test("Usernames should be Unique (for real Users)", async () => {
  const conn = await connectionFactory();
  const { User } = conn.models;
  const params = { username: "crabbyFace13", password: "passy1234", playStyle: "casual" };
  const id = await User.exists({ username: "crabbyFace13" });
  const uniqueUser = id !== null ? await User.findById(id) : await AddNewUserToDB(User, params);
  params.username = uniqueUser.username;
  await expect(async () => await await AddNewUserToDB(User, params)).rejects.toThrow();
  await conn.close();
});

describe("Create Guest", () => {
  let conn, createdGuest, Guest;
  beforeAll(async () => {
    conn = await connectionFactory();
    Guest = conn.models.Guest;
    createdGuest = await AddNewGuestToDB(Guest);
  });
  afterAll(async () => {
    if (createdGuest !== undefined) {
      await createdGuest.deleteOne({ _id: createdGuest._id });
    }
    await conn.close();
  });
  test(`New Guest should exist`, async () => {
    expect(createdGuest).toBeTruthy();
  });
  test(`New Guest should have default username 'Guest' and playstyle'casual'`, async () => {
    expect(createdGuest.username).toEqual("guest");
    expect(createdGuest.playStyle).toEqual("casual");
  });
});
