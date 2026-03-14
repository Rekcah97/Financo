import express from "express";
import { rateLimit } from "express-rate-limit";
import Routes from "./Routes/index.js";
import helmet from "helmet";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const timeFor1Hr = 60 * 60 * 1000;
const MAX_REQUEST_AUTH = 20;
const MAX_REQUEST_GENERAL = 1000;
const app = express();

//rate limiters
const authLimiter = rateLimit({
  max: MAX_REQUEST_AUTH,
  windowMs: timeFor1Hr,
  message:
    "we have reached too many auth request from this ip address. pls retry in 1 hour",
});

const generalLimiter = rateLimit({
  max: MAX_REQUEST_GENERAL,
  windowMs: timeFor1Hr,
  skip: (req) => req.originalUrl.startsWith("/api/auth"),
  message:
    "we have reached too many request from this ip address. pls retry in 1 hour",
});

//middleware
app.use(express.json());
app.use(helmet());
app.use("/api/auth", authLimiter);
app.use("/", generalLimiter);

//routes
app.use("/api", Routes);
app.use(notFound);
app.use(errorHandler);

export default app;
