import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(404)
        .json({ success: false, msg: "invalid or empty token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(500).json({ sucess: false, msg: "Token Expired" });
    } else {
      return res
        .status(500)
        .json({ sucess: false, msg: "Internal Server Error" });
    }
  }
};
