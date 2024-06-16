import { default as MakeApp } from "./app.mjs";
import http from "node:http";
import { env } from "node:process";
const https = await import("node:https");

const { PORT } = env;
const HOST = "0.0.0.0";

const app = MakeApp();
http.createServer(app).listen(PORT, HOST);
https.createServer(app).listen(PORT, HOST);
