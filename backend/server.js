import express from "express";
import { startServer } from "./utils/startServer.utils.js";
import { cleanupExpiredEntries } from "./jobs/cleanupExpiredEntries.utils.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

await startServer(app, port);

await cleanupExpiredEntries();
setInterval(cleanupExpiredEntries, 30 * 24 * 1000);
