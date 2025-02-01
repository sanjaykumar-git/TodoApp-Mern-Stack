import jwt from "jsonwebtoken"
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  console.log("Cookies Received:", req.cookies); // ✅ Debugging

  const token = req.cookies?.access_token;
  if (!token) {
    return next(createError(400, "Not Authenticated - No token received!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.user = user;
    next();
  });
};
