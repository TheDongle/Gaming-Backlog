import { expect, jest, test } from "@jest/globals";
import { connectionFactory } from "../connection.mjs";
import {
  createEntry,
  updateEntry,
  deleteEntry,
  verifyPassword,
  findModel,
} from "./user_methods.mjs";

describe("Create Entry", () => {
  const params = { username: "Testyman5000", password: "12345trying", playStyle: "casual" };
  let conn, model, user;
  beforeAll(async () => {
    conn = await connectionFactory();
    model = conn.models.TestUser;
    user = await createEntry(model, params);
  });
  afterAll(async () => {
    if (user && (await model.exists({ _id: user._id }))) {
      await model.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Established connection should have readystate 1", async () => {
    expect(conn.readyState).toBe(1);
  });
  test("Create Entry - Valid Entries should be created", async () => {
    expect(user).toBeDefined();
    expect(user.username).toBe(params.username);
    expect(user.playStyle).toBe(params.playStyle);
  });
  test("Create Entry - Invalid Entries should be error", async () => {
    let newName = "Newt";
    await expect(
      async () => await updateEntry(model, user._id, { username: newName }),
    ).rejects.toThrow();
    let newStyle = "comp";
    await expect(
      async () => await updateEntry(model, user._id, { playStyle: newStyle }),
    ).rejects.toThrow();
    let newPass = "123";
    await expect(
      async () => await updateEntry(model, user._id, { password: newPass }),
    ).rejects.toThrow();
  });
});

describe("VerifyPassword", () => {
  const params = { username: "Testyman5014", password: "12345trying", playStyle: "casual" };
  let conn, model, user;
  beforeAll(async () => {
    conn = await connectionFactory();
    model = conn.models.TestUser;
    user = await createEntry(model, params);
  });
  afterAll(async () => {
    if (user && (await model.exists({ _id: user._id }))) {
      await model.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Valid password should return user", async () => {
    const passwordMatches = await verifyPassword(model, params.username, "12345trying");
    expect(passwordMatches).toBeTruthy();
  });
  test("Invalid username/password should error", async () => {
    await expect(
      async () => await verifyPassword(model, user.username, "NotCorrect123"),
    ).rejects.toThrow();
    await expect(
      async () => await verifyPassword(model, "NotCorrect123", params.password),
    ).rejects.toThrow();
  });
});

describe("Update Entry", () => {
  const params = { username: "Testyman42330", password: "12345trying", playStyle: "casual" };
  let conn, model, user;
  beforeAll(async () => {
    conn = await connectionFactory();
    model = conn.models.TestUser;
    user = await createEntry(model, params);
  });
  afterAll(async () => {
    if (user && (await model.exists({ _id: user._id }))) {
      await model.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Valid Updates should be saved to DB", async () => {
    let newName = "NewNewNewName";
    let { username } = await updateEntry(model, user._id, { username: newName });
    expect(username).toBe(newName);
    let newStyle = "completionist";
    let { playStyle } = await updateEntry(model, user._id, { playStyle: newStyle });
    expect(playStyle).toBe(newStyle);
    let newPass = "NewNewNewPassw00000rd";
    await updateEntry(model, user._id, { password: newPass });
    const passwordMatches = await verifyPassword(model, newName, newPass);
    expect(passwordMatches).toBeTruthy();
  });
  test("Invalid Updates should error", async () => {
    let newName = "Newt";
    await expect(
      async () => await updateEntry(model, user._id, { username: newName }),
    ).rejects.toThrow();
    let newStyle = "comp";
    await expect(
      async () => await updateEntry(model, user._id, { playStyle: newStyle }),
    ).rejects.toThrow();
    let newPass = "123";
    await expect(
      async () => await updateEntry(model, user._id, { password: newPass }),
    ).rejects.toThrow();
  });
});

describe("Delete Entry", () => {
  const params = { username: "Testyman5000", password: "12345trying", playStyle: "casual" };
  let conn, model, user;
  beforeAll(async () => {
    conn = await connectionFactory();
    model = conn.models.TestUser;
    user = await createEntry(model, params);
  });
  afterAll(async () => {
    if (user && (await model.exists({ _id: user._id }))) {
      await model.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("User should be deleted", async () => {
    await deleteEntry(model, user._id);
    expect(model.exists({ _id: user._id })).not.toBeDefined;
  });
});

describe("Find Model", () => {
  const params = { username: "Testymanny01", password: "12345tr000ng", playStyle: "casual" };
  let conn, model, user;
  beforeAll(async () => {
    conn = await connectionFactory();
    model = conn.models.TestUser;
    user = await createEntry(model, params);
  });
  afterAll(async () => {
    if (user && (await model.exists({ _id: user._id }))) {
      await model.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("If user exists, function should return user's modelName", async () => {
    expect(await findModel(user._id, conn.models)).toBe(model.modelName);
  });
  test("If user doesn't exist, function should return empty string", async () => {
    const params = { username: "Sacrifice123", password: "12345tr000ng", playStyle: "casual" };
    let newGuy = await createEntry(model, params);
    await deleteEntry(model, newGuy._id);
    expect(await findModel(newGuy._id, conn.models)).toEqual("");
  });
});
