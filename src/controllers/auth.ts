import { Request, Response } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import passport from "passport";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const localStrategy = require("passport-local").Strategy;

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const q = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (q.rows.length > 0) {
      return res
        .status(401)
        .json("User with that email or username already exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const q = await db.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
      );
      if (q.rows.length > 0) {
        return res.status(201).json({
          message: "User created successfully",
        });
      } else {
        return res.status(401).json({
          message: "Something went wrong while creating user",
        });
      }
    }
  } catch (err) {
    console.log("error here is", err);
    res.status(500).json({
      message: "Something went wrong while creating user",
    });
  }
};

passport.use(
  new localStrategy(
    {
      usernameField: "email",
    },
    async (email: string, password: string, done: any) => {
      console.log("called");
      const q = await db.query(
        "SELECT * FROM users WHERE email = $1   OR username = $1",
        [email]
      );
      if (q.rows.length > 0) {
        const user = q.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      }
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const q = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  if (q.rows.length > 0) {
    return done(null, q.rows[0]);
  }
});
