import User from "../models/user.js";

export let signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

export let signup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newuser = new User({ email, username });
    let user = await User.register(newuser, password);
    req.flash("success", "New user added");
    console.log(user);
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wonderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("err", e.message);
    res.redirect("/signup");
  }
};

export let loginForm = (req, res) => {
  res.render("users/login");
};

export let login = async (req, res) => {
  req.flash("success", "Welcomeback to WonderLust");
  console.log(req.session.redirectUrl);
  let redirectedUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectedUrl);
};

export let logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User has been logged out");
    res.redirect("/listings");
  });
};
