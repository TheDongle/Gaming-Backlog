import { default as MakeApp } from "./app.mjs";
import { connectionFactory } from "./db/index.mjs";

const app = MakeApp(await connectionFactory());

app.listen(3000, "127.0.0.1");
