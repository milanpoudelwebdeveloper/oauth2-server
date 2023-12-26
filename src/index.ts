import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import auth from "./routes/auth";
import { isAuthenticated } from "./middleware/isAuthenticated";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth);
app.get("/resources", isAuthenticated, (_, res) => {
  res.status(200).json({
    message: "You have accessed the protected resource",
    data: "hellow rold",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
