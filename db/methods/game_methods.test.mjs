import { expect, jest, test } from "@jest/globals";
import { connectionFactory } from "../connection.mjs";
import { reconcileGames, createGame, deleteGame } from "./game_methods.mjs";
import mongoose from "mongoose";

describe("Create Game", () => {
  let conn, userModel, gameModel, user;
  const params = {
    username: "Gamertester12",
    password: "gamesgames1",
    playStyle: "completionist",
  };
  beforeAll(async () => {
    conn = await connectionFactory();
    userModel = conn.models.TestUser;
    gameModel = conn.models.Game;
    user = await userModel.create(params);
  });
  afterAll(async () => {
    if (user && (await userModel.exists({ _id: user._id }))) {
      await userModel.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Valid Game should be created", async () => {
    let newGame = { title: "God of War 10", standardLength: 10, completionist: 100 };
    let returned = await createGame(userModel, user._id, new gameModel(newGame));
    expect(returned.games).toBeInstanceOf(Array);
    let entry = returned.games.find((game) => game.title === newGame.title);
    expect(entry).toBeDefined();
    expect(entry.standardLength).toBe(newGame.standardLength);
    expect(entry.completionist).toBe(newGame.completionist);
  });
  test("Invalid game should error", async () => {
    let newGame = { title: "BumbleBee", standardLength: 10 };
    await expect(
      async () => await createGame(userModel, user._id, new gameModel(newGame)),
    ).rejects.toThrow();
    newGame = { title: "God of Bees", completionist: 10 };
    await expect(
      async () => await createGame(userModel, user._id, new gameModel(newGame)),
    ).rejects.toThrow();
  });
  test("Duplicate games should error", async () => {
    let newGame = { title: "Gonna play this Twice", standardLength: 5, completionist: 20 };
    await createGame(userModel, user._id, new gameModel(newGame));
    await expect(
      async () => await createGame(userModel, user._id, new gameModel(newGame)),
    ).rejects.toThrow();
  });
});

describe("Delete Game", () => {
  let conn, userModel, gameModel, user;
  const params = {
    username: "GamerDeleter999",
    password: "gamesgames123",
    playStyle: "completionist",
  };
  beforeAll(async () => {
    conn = await connectionFactory();
    userModel = conn.models.TestUser;
    gameModel = conn.models.Game;
    user = await userModel.create(params);
  });
  afterAll(async () => {
    if (user && (await userModel.exists({ _id: user._id }))) {
      await userModel.deleteOne({ _id: user._id });
    }
    await conn.close();
  });
  test("Created Game should be deleted", async () => {
    let newGame = { title: "DeleteLater", standardLength: 10, completionist: 100 };
    await createGame(userModel, user._id, new gameModel(newGame));
    let returned = await deleteGame(userModel, user._id, newGame.title);
    expect(returned.games.find((game) => game.title === newGame.title)).not.toBeDefined();
  });
  test("Rest of Games array shouldn't be affected by deletion", async () => {
    let newGames = [
      { title: "GameOne", standardLength: 10, completionist: 100 },
      { title: "GameTwo", standardLength: 10, completionist: 100 },
      { title: "GameThree", standardLength: 10, completionist: 100 },
      { title: "GameFour", standardLength: 10, completionist: 100 },
    ];
    for (let i = 0; i < newGames.length; i++) {
      await createGame(userModel, user._id, new gameModel(newGames[i]));
    }
    let returned = await deleteGame(userModel, user._id, newGames[2].title);
    expect(returned.games.find((game) => game.title === newGames[0].title)).toBeDefined();
    expect(returned.games.find((game) => game.title === newGames[1].title)).toBeDefined();
    expect(returned.games.find((game) => game.title === newGames[2].title)).not.toBeDefined();
    expect(returned.games.find((game) => game.title === newGames[3].title)).toBeDefined();
  });
});

describe("Reconcile Games", () => {
  let conn, userModel, gameModel, userOne, userTwo;
  const paramsOne = {
    username: "GameReconciler",
    password: "gamesgames123",
    playStyle: "completionist",
  };
  const paramsTwo = {
    username: "GuestMan123",
    password: "gamesgames123",
    playStyle: "completionist",
  };
  beforeAll(async () => {
    conn = await connectionFactory();
    userModel = conn.models.TestUser;
    gameModel = conn.models.Game;
    userOne = await userModel.create(paramsOne);
    userTwo = await userModel.create(paramsTwo);
  });
  afterAll(async () => {
    if (userOne && (await userModel.exists({ _id: userOne._id }))) {
      await userModel.deleteOne({ _id: userOne._id });
    }
    if (userTwo && (await userModel.exists({ _id: userTwo._id }))) {
      await userModel.deleteOne({ _id: userTwo._id });
    }
    await conn.close();
  });
  test("Arrays should be reconciled", async () => {
    let someGames = [
      { title: "GameOne", standardLength: 10, completionist: 100 },
      { title: "GameTwo", standardLength: 10, completionist: 100 },
      { title: "GameThree", standardLength: 10, completionist: 100 },
      { title: "GameFour", standardLength: 10, completionist: 100 },
    ];
    let someMoreGames = [
      { title: "GameFive", standardLength: 10, completionist: 100 },
      { title: "GameSix", standardLength: 10, completionist: 100 },
      { title: "GameSeven", standardLength: 10, completionist: 100 },
      { title: "GameEight", standardLength: 10, completionist: 100 },
    ];
    for (let i = 0; i < someGames.length; i++) {
      await createGame(userModel, userOne._id, new gameModel(someGames[i]));
    }
    for (let i = 0; i < someMoreGames.length; i++) {
      await createGame(userModel, userTwo._id, new gameModel(someMoreGames[i]));
    }
    let returned = await reconcileGames(userModel, userOne, userModel, userTwo);
    for (let i = 0; i < someGames.length; i++) {
      expect(returned.games.find((game) => game.title === someGames[i].title)).toBeDefined();
    }
    for (let i = 0; i < someMoreGames.length; i++) {
      expect(returned.games.find((game) => game.title === someMoreGames[i].title)).toBeDefined();
    }
  });
});
