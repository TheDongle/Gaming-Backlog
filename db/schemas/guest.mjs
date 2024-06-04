import { Schema } from "mongoose";
import { baseSchema } from "./baseUser.mjs";
const { randomUUID } = await import("node:crypto");

const guestSchema = new Schema();
guestSchema.add(baseSchema);
guestSchema.add({
  username: {
    type: String,
    default: "guest",
  },
});

export { guestSchema };
