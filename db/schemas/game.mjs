import { Schema } from "mongoose";

const gameSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    standardLength: {
      type: Number,
      required: true,
      message: "No data found for time to beat this game",
    },
    completionist: {
      type: Number,
      required: true,
      message: "No data found for time to beat this game",
    },
  },
  { _id: false }
);

export { gameSchema };
