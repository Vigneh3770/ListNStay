// if (process.env.NODE_ENV != "production") {
//   await import("dotenv/config");
// }

import "dotenv/config";
import express from "express";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import passport from "passport";

import LocalStrategy from "passport-local";
import wrapAsync from "./utils/wrapAsync.js";
import expressErrors from "./utils/expressErrors.js";
import listingsRouter from "./routes/listing.js";
import reviewsRouter from "./routes/reviews.js";
import userRouter from "./routes/users.js";
import User from "./models/user.js";
import dns from "dns";
import { MongoStore } from "connect-mongo";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

const app = express();
const port = 8000;
const dbUrl = process.env.ATLASDB_URL;

//view engines
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

//middlewares

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// dns.setServers(["8.8.8.8", "1.1.1.1"]);
main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

app.use(cookieParser("code"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("error in Mongo Session Store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deletion = req.flash("deletion");
  res.locals.updation = req.flash("updation");
  res.locals.err = req.flash("err");
  res.locals.currUser = req.user;

  next();
});

//Mongo Connection
async function main() {
  await mongoose.connect(dbUrl);
  console.log("DBConnected");
}

// const token = (req, res, next) => {
//   let { token } = req.query;
//   if (token === "giveaccess") {
//     next();
//   } else {
//     res.send("ACCESS DENIED");
//   }
// };

// routes

// app.get("/registerUser", async (req, res) => {
//   let newUser = new User({
//     email: "student@gmail.com",
//     username: "Viggi",
//   });
//   let user = await User.register(newUser, "helloworld");

//   res.send(user);
// });
app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

// app.use((req, res, next) => {
//   req.time = new Date().toString();
//   next();
// });

//root
// app.get(
//   "/",
//   wrapAsync(async (req, res) => {
//     res.send("root");
//   }),
// );

//Error handling middleware
app.use((req, res, next) => {
  return next(new expressErrors(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Somehting went wrong" } = err;
  // res.render("listings/error.ejs", { statusCode, message });

  res.status(status).render("listings/error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server running on port port ${port}`);
});
