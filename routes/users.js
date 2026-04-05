import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";

import { saveRedirectUrl } from "../middlewares.js";
import {
  signupForm,
  signup,
  loginForm,
  login,
  logout,
} from "../controllers/users.js";

router.route("/signup").get(signupForm).post(wrapAsync(signup));

router
  .route("/login")
  .get(loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: { type: "err" },
    }),
    login,
  );

router.get("/logout", logout);

export default router;
