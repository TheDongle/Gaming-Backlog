import { Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
const uniqueValidator = mongooseUniqueValidator;
import { baseSchema } from "./baseUser.mjs";
import { passwordValidation, usernameValidation, playStyleValidation } from "../validation.mjs";
import bcrypt, { hashSync } from "bcrypt";

const userSchema = new Schema();
userSchema.add(baseSchema);
userSchema.add({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return RegExp(usernameValidation.pattern).test(value);
      },
      message: usernameValidation.message,
    },
  },
  password: {
    type: String,
    required: true,
  },
  // expireAt: {
  //   default: Date.now(),
  //   type: Date,
  //   expires: 182 * 24 * 60 * 60,
  // },
});

userSchema.plugin(uniqueValidator);

export { userSchema };
