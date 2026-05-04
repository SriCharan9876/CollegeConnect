import { Request, Response } from "express";
import { sql } from "../db/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashed})
    `;
    res.json({ message: "User created" });
  } catch {
    res.status(400).json({ error: "User exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  if (!user[0]) return res.status(401).json({ error: "Invalid email" });

  const valid = await bcrypt.compare(password, user[0].password);

  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET || "secret");

  res.json({ token });
};