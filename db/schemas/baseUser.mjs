import { Schema } from "mongoose";
import { gameSchema } from "./game.mjs";
import { playStyleValidation } from "../validation.mjs";
import { validate } from "uuid";

const baseSchema = new Schema(
  {
    playStyle: {
      type: String,
      default: "casual",
      validate: {
        validator: function (value) {
          return RegExp(playStyleValidation.pattern).test(value);
        },
        message: playStyleValidation.message,
      },
      required: [true, "A Playstyle is required"],
    },
    games: {
      type: [gameSchema],
      validate: {
        validator: function () {
          let newGame = this.games.at(-1);
          for (let i = 0; i < this.games.length - 1; i++) {
            if (this.games[i].title === newGame.title) {
              return false;
            }
          }
          return true;
        },
        message: (props) => `Duplicate game entry for ${props.value} disregarded`,
      },
    },
    expireAt: {
      default: Date.now(),
      type: Date,
      expires: 24 * 60 * 60,
    },
  },
  { timestamps: true },
  { collection: "users" },
  { validateModifiedOnly: true },
);

// this wasn't quite right - expired immediately
// baseSchema.pre("init", function () {
//   let user = this;
//   user.expireAt = user.updatedAt
// });

export { baseSchema };
