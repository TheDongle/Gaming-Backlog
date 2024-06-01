import process from "node:process";
import { connectionFactory } from "./index.mjs"
const conn = await connectionFactory(process.env.mongoURI);
const { User, Game, Guest } = conn.models


Guest.$where(this.updatedAt.getTime() < (Date.now() - (1 * 24 * 60 * 60 * 1000)))

// lte