import mongoose from "mongoose";
import { gameSchema } from "./schemas/game.mjs";
import { guestSchema } from "./schemas/guest.mjs";
import { userSchema } from "./schemas/user.mjs";
import { testUserSchema } from "./schemas/testUser.mjs";
import { env } from "node:process";

async function connectionFactory() {
  const uri = env.mongoURI;
  const conn = await mongoose.createConnection(uri, { maxPoolSize: 10 }).asPromise();
  conn.model("TestUser", testUserSchema);
  conn.model("User", userSchema);
  conn.model("Game", gameSchema);
  conn.model("Guest", guestSchema);
  return conn;
}

export { connectionFactory };
