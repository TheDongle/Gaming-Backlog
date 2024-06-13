import { Schema } from "mongoose";

const resultsSchema = new Schema({
  titles: {
    type: [String],
    required: true,
  },
  links: {
    type: [String],
    required: true,
  },
  expireAt: {
    default: Date.now(),
    type: Date,
    expires: 30 * 60,
  },
});

export { resultsSchema };
