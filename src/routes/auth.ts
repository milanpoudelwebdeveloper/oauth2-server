import { User, registerUser } from "../controllers/auth";
import express, { Request } from "express";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", (req, res) => {
  passport.authenticate("local", (err: Error, user: User, info: any) => {
    console.log("the info is", info);
    if (err) throw err;
    if (!user) return res.status(401).json(info);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        console.log("the user is", user);
        res.status(200).json({
          message: "Successfully authenticated",
        });
      });
    }
  })(req, res);
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong while logging out",
      });
    }
    return res.status(200).json({
      message: "Successfully logged out",
    });
  });
});

export default router;
