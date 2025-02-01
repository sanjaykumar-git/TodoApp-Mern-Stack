import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res, next) {
  const data = req.body;
  console.log(req.body);

  if (!data?.email || !data?.password) {
    return next(createError(400, "Missing field"));
  }

  await connectToDB();
  const alreadyRegistered = await User.exists({ email: data.email });
  if (alreadyRegistered) return next(createError(400, "User already exists"));

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({ ...req.body, password: hash });
  await newUser.save();

  res.status(201).json({ message: "User created successfully" });
}

export async function login(req, res, next) {
  const data = req.body;
  console.log(req.body);

  if (!data?.email || !data?.password) {
    return next(createError(400, "Missing field"));
  }

  await connectToDB();
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(createError(400, "Invalid credentials"));

  const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordCorrect) return next(createError(400, "Invalid credentials"));

  const token = jwt.sign({ id: user._id }, process.env.JWT || "defaultSecret", { expiresIn: "1h" });

  console.log(token);
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  .status(200)
  .json({ message: "User logged in successfully", token });
}

export async function logout(req, res, next) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }).status(200).json({ message: "User logged out successfully" });
}
