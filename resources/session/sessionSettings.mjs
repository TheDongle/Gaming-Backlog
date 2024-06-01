import * as process from "node:process";
const { SECRET1, SECRET2, SECRET3 } = process.env;

const settings = {
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: true,
    validated: false,
  },
  resave: false,
  saveUninitialized: true,
  secret: [SECRET1, SECRET2, SECRET3],
  unset: "keep",
};

export { settings };
