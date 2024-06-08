import { env } from "node:process";
import { gameSchema } from "./schemas/game.mjs";
import { guestSchema } from "./schemas/guest.mjs";
import { userSchema } from "./schemas/user.mjs";
import { testUserSchema } from "./schemas/testUser.mjs";
import mongoose from "mongoose";

async function connectionFactory() {
  const conn = await mongoose.createConnection(env.mongoURI, { maxPoolSize: 100 }).asPromise();
  conn.model("TestUser", testUserSchema);
  conn.model("User", userSchema);
  conn.model("Game", gameSchema);
  conn.model("Guest", guestSchema);
  return conn;
}

export { connectionFactory };
