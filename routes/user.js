const express = require("express");
const router = express.Router();
const User = require("../models/userauth.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registereduser = await User.register(newUser, password);
      console.log(registereduser);
      //automatically login when sign up happen
      req.login(registereduser, (err)=>{
        if(err) return next(err);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect(req.session.redirectUrl);
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);



router.get("/logout",(req, res)=>{
  // it takes call back as parameter
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Goodbye!");
    res.redirect("/listings");
  })
})
module.exports = router;
