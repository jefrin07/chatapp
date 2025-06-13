import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js"; // adjust path as needed

// Helper to send JWT token in cookie
function sendToken(user, res, message = "Success") {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password, ...userData } = user.toObject();
  return res.status(200).json({ message, user: userData });
}

// SIGNUP
export async function signup(req, res) {
  try {
    const { email, password, fullname } = req.body;

    // Basic validations
    if (!email || !password || !fullname) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const avatarNumber = Math.floor(Math.random() * 100) + 1;
    const profilePic = `https://avatar.iran.liara.run/public/${avatarNumber}`;

    const newUser = new User({
      email,
      password,
      fullname,
      profilePic,
    });

    await newUser.save();

    try {
      await upsertStreamUser({
        id: newUser._id.toString(), // Use MongoDB user ID or any unique identifier
        name: newUser.fullname,
        image: newUser.profilePic || "",
      });
      console.log("Created Stream user");
    } catch (streamError) {
      console.error("Failed to create Stream user:", streamError.message);
    }

    return sendToken(newUser, res, "User created successfully");
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    return sendToken(user, res, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// LOGOUT
export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
}

export async function onBoard(req, res) {
  try {
    const userId = req.user._id;

    const { fullname, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullname ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullname}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
