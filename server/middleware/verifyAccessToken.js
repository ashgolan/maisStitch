import { env } from "process";
import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const secretKey = env.ACCESS_TOKEN_SECRET;
  const accessToken = req.header("Authorization");
  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Access Token missing" });
  }
  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "{צריך להיכנס כמנהל למערכת!!!}" });
  }
};
