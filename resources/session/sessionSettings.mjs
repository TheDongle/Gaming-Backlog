import { env } from "node:process";

const settings = {
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: true,
    validated: false,
  },
  resave: false,
  saveUninitialized: true,
  secret: [env.SECRET1, env.SECRET2, env.SECRET3],
  unset: "destroy",
};

export { settings };
