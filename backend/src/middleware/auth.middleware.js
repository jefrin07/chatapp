import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Fetch user from DB and attach to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next(); // Pass control to the next middleware/route
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token error" });
  }
};
