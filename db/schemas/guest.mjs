import { Schema } from "mongoose";
import { baseSchema } from "./baseUser.mjs";

const guestSchema = new Schema();
guestSchema.add(baseSchema);
guestSchema.add({
  username: {
    type: String,
    default: "guest",
  },
  expiryCounter: {
    default: Date.now(),
    type: Date,
  },
});

guestSchema.path("expiryCounter").index({ expires: 14 * 24 * 60 * 60 });

export { guestSchema };
