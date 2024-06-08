import assert from "node:assert";
import mongoose from "mongoose";

async function reconcileGames(userModel, userID, guestModel, guestID) {
  const [guest, user] = await Promise.all([
    guestModel.findById(guestID),
    userModel.findById(userID),
  ]);
  for (let game of guest.games) {
    await user.games.addToSet(game);
  }
  await Promise.all([guestModel.deleteOne({ _id: guestID }), user.save()]);
  return user;
}

async function createGame(model, id, game) {
  const user = await model.findById(id);
  user.games.push(game);
  await user.save();
  return user;
}

async function deleteGame(model, id, gameTitle) {
  const user = await model.findById(id);
  user.games = user.games.filter((game) => game.title !== gameTitle);
  await user.save();
  return user;
}

export { reconcileGames, createGame, deleteGame };
