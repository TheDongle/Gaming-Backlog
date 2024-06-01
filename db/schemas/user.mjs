import { Schema } from "mongoose";
import bcrypt, { hashSync } from "bcrypt";
import mongooseUniqueValidator from "mongoose-unique-validator";
const uniqueValidator = mongooseUniqueValidator;
import { baseSchema } from "./baseUser.mjs";
import { passwordValidation, usernameValidation, playStyleValidation } from "../validation.mjs";

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
    validate: {
      validator: function (value) {
        return RegExp(passwordValidation.pattern).test(value);
      },
      message: passwordValidation.message,
    },
  },
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 10);
    user.$markValid("password");
  }
});

userSchema.pre("findOneAndUpdate", async function () {
  const query = this;
  const update = { ...query.getUpdate() };
  const updateHas = (prop) => prop in update;
  switch (true) {
    case updateHas("password"):
      if (!RegExp(passwordValidation.pattern).test(update.password)) {
        throw new Error(passwordValidation.message);
      }
      update.password = bcrypt.hashSync(update.password, 10);
      query.setUpdate(update);
      break;
    case updateHas("username"):
      if (!RegExp(usernameValidation.pattern).test(update.username)) {
        throw new Error(usernameValidation.message);
      }
      break;
    case updateHas("playStyle"):
      if (!RegExp(playStyleValidation.pattern).test(update.playStyle)) {
        throw new Error(playStyleValidation.message);
      }
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

export { userSchema };
