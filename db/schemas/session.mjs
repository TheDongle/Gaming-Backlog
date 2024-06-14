import { Schema } from "mongoose";

const sessionSchema = new Schema({
  session: { type: String },
  expires: { type: Date },
});

export { sessionSchema };
