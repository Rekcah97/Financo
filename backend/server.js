import express from "express";
import { startServer } from "./utils/startServer.utils.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

await startServer(app, port);
