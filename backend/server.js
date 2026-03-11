import app from "./app.js";
import { startServer } from "./utils/startServer.utils.js";
import { cleanupExpiredEntries } from "./jobs/cleanupExpiredEntries.utils.js";

const timeFor30Min = 30 * 60 * 1000;
const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

await startServer(app, port);

await cleanupExpiredEntries();
setInterval(cleanupExpiredEntries, timeFor30Min);
