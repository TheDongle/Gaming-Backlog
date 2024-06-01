import { connectionFactory } from "../../db/index.mjs";
import { updateDb } from "./update.mjs";
import { app } from "../../app.mjs";
import { AddNewUserToDB, AddNewGuestToDB } from "./create.mjs";
import { expect, jest, test } from "@jest/globals";
import request from "supertest";

describe("Update User", () => {
  let conn, TestUser, params, createdUser;
  beforeAll(async () => {
    conn = await connectionFactory();
    TestUser = conn.models.TestUser;
  });
  beforeEach(async () => {
    params = { username: "crabbyFace10", password: "passy1234", playStyle: "casual" };
    createdUser = await AddNewUserToDB(TestUser, params);
  });
  afterEach(async () => {
    if (createdUser !== undefined) {
      await TestUser.deleteOne({ _id: createdUser._id });
    }
  });
  afterAll(async () => {
    await conn.close();
  });
  test(`Username should be updated`, async () => {
    const newName = "whyAmIsoDumb";
    await updateDb(createdUser._id, { username: newName }, TestUser);
    let foundUser = await TestUser.findById(createdUser._id);
    expect(foundUser.username).toEqual(newName);
  });
  test(`PlayStyle should be updated`, async () => {
    const newStyle = "completionist";
    await updateDb(createdUser._id, { playStyle: newStyle }, TestUser);
    let foundUser = await TestUser.findById(createdUser._id);
    expect(foundUser.playStyle).toEqual(newStyle);
  });
  test(`Password should be updated`, async () => {
    const newPass = "VeryNew82";
    await updateDb(createdUser._id, { password: newPass }, TestUser);
    let foundUser = await TestUser.findById(createdUser._id);
    expect(foundUser.comparePassword(newPass)).resolves.toBe(true);
  });
  test(`Invalid Username should not be accepted`, async () => {
    const newName = "Invalid";
    try {
      await updateDb(createdUser._id, { username: newName }, TestUser);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      let foundUser = await TestUser.findById(createdUser._id);
      expect(foundUser.username).not.toBe(newName);
    }
  });
  test(`Invalid playStyle should not be accepted`, async () => {
    const newStyle = "Invalid";
    try {
      await updateDb(createdUser._id, { playStyle: newStyle }, TestUser);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      let foundUser = await TestUser.findById(createdUser._id);
      expect(foundUser.playStyle).not.toBe(newStyle);
    }
  });
  test(`Invalid Password should not be accepted`, async () => {
    const newPass = "Invalid";
    try {
      await updateDb(createdUser._id, { password: newPass }, TestUser);
    } catch (err) {
    } finally {
      let foundUser = await TestUser.findById(createdUser._id);
      expect(foundUser.comparePassword(newPass)).resolves.toBe(false);
    }
  });
});

