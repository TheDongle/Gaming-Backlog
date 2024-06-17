import { env } from "node:process";
import { gameSchema } from "./schemas/game.mjs";
import { guestSchema } from "./schemas/guest.mjs";
import { userSchema } from "./schemas/user.mjs";
import { testUserSchema } from "./schemas/testUser.mjs";
import { resultsSchema } from "./schemas/searchresults.mjs";
import { sessionSchema } from "./schemas/session.mjs";
import mongoose from "mongoose";

/**
 * @param  {...Object} customSchemas - Any quantity of objects, structured as { ModelName : Schema }
 * @returns
 */

// Binds Models to a fresh DB Connection
async function connectionFactory(...customSchemas) {
  console.log(env)
  const conn = await mongoose.createConnection(env.mongoURI, { maxPoolSize: 100 }).asPromise();
  const schemas = {
    TestUser: testUserSchema,
    Session: sessionSchema,
    User: userSchema,
    SearchResults: resultsSchema,
    Game: gameSchema,
    Guest: guestSchema,
  };
  for (let [modelName, schema] of Object.entries(Object.assign(schemas, ...customSchemas))) {
    conn.model(modelName, schema);
  }
  return conn;
}

export { connectionFactory };
