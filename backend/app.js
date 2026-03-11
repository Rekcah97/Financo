import express from "express";
import { rateLimit } from "express-rate-limit";
import Routes from "./Routes/index.js";

const timeFor1Hr = 60 * 60 * 1000;
const MAX_REQUEST_AUTH = 20;
const MAX_REQUEST_GENERAL = 1000;
const app = express();

//rate limiters
const generalLimiter = rateLimit({
  max: MAX_REQUEST_GENERAL,
  windowMs: timeFor1Hr,
  skip: (req) => req.path.startsWith("/api/auth"),
  message:
    "we have reached too many request from this ip address. pls retry in 1 hour",
});

const authLimiter = rateLimit({
  max: MAX_REQUEST_AUTH,
  windowMs: timeFor1Hr,
  message:
    "we have reached too many auth request from this ip address. pls retry in 1 hour",
});

//middleware
app.use(express.json());
app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

//routes
app.use("/api", Routes);

export default app;
