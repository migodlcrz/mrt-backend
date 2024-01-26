import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt, { Secret } from "jsonwebtoken";

interface CreateRequestBody {
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const createToken = (_id: string, email: string) => {
  const secretOrPrivateKey: Secret = process.env.SECRET || "";
  return jwt.sign({ _id: _id, email: email }, secretOrPrivateKey, {
    expiresIn: "1h",
  });
};

// login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequestBody = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "All fields must be filled." });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ error: "Email Invalid." });
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    res.status(400).json({ error: "Incorrect password." });
    return;
  }

  try {
    const token = createToken(user._id, user.email);
    const user_ = user.email;
    const pass_ = user.password;
    res.status(200).json({ user_, jwt: token });
    // res.status(200).json({ jwt: token });
  } catch (error) {
    res.status(400).json({ error: "INTERNAL ERROR" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password }: CreateRequestBody = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "All fields must be filled." });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ error: "Invalid email." });
    return;
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400).json({
      error:
        "Password must be at least 8 characters long, should contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    });
    return;
  }

  const exist = await User.findOne({ email });

  if (exist) {
    res.status(400).json({ error: "Email already exists." });
    return;
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ email, password: hashedPassword });

    const token = createToken(user._id, user.email);

    const user_ = user.email;
    const pass_ = user.password;

    res.status(200).json({ user_, token });
  } catch (error) {
    res.status(400).json({ error: "INTERNAL ERROR" });
  }
};
