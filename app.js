//1) require the libraries, packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/userauth.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
// 3)for database

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions ={
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000, // miliseconds
    maxAge:  7 * 24 * 60 * 1000,
    httpOnly: true // to prevent the cross scripting attacks
  }
}


app.get(
  "/",
  wrapAsync((req, res) => {
    res.send("Hi, I am root");
  })
);


app.use(session(sessionOptions))
app.use(flash());
// use flash before the routes
 
// 1 session = 1 individual user so, it comes after the session
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
// serialize - store user info in to the session
passport.deserializeUser(User.deserializeUser());
// deserialize - remove user info from the sesion
app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  /* console.log(success); */
  next();
})



/* 
// 4)testLising model
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
}); */
//2) listening

// handling custom errors:
// custom error handing middleware

// if above all routes will checked if nothing is
// there(res not send) then here it will come and
// execute


// demo user- for authentication
app.get("/demouser", async (req, res)=>{
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "nasruddin"
  });
// static method - to store - parameter(User, password, or cb)
/* 
register(user, password, cb) - 
  convenience method to register a new user instance with a given
  password. Ckeck if username is unique. See login example

*/
  let registereduser = await User.register(fakeUser, "helloworld");
  res.send(registereduser);
})

/*  output:
{"email":"student@gmail.com","_id":"6641db01f325da8e615d5e8e","username":"nasruddin","salt":"cda187c44482919ce2d7a177aa9fbc78aac180a21d2b23d826800988495e9959","hash":"71e50c8c1f04729ea0a830d07c7304482fa9401071eaa9e92d05fb91855a3220095813376e1b5bb683fee65c21ba0608dcb2d0320b2e0c5c1f09e375b6bf3107254f3141db54e5195600ee621d93d048d186ad87acd7f3aa76e5c941813b56a0a97fac3bd301e6a3e0d4290db258ec6ebc0791a17f8d41f3cb77f831ed7c683714aea1a36824c2b7666f1103ac737e3fcca73f2711d8e15044316d4fac9137e2c001eb581aeb421619908b3b268a8c16bde45e6306281612ed07845cae94e0365457adfb44e5a1d6e0c910ae25bfceedbb8f7e4d1ea9f84d5cc007eda2df04455164f033245eb0263191e278132f5a58bef365ff51a51b422f07f017fcdd065b71fb2e9955db2bebd1ad9aba5a137ddb1a49ac74db673bc82a9ddc3f8d211183b868c479ae524d6806f6ce158fdfeff408243d8573ac937c6f088f93f7a534f16eff8328ff37bcc58e206554c6bad4f89da2bb8a313b1a15dcab54862e56a2659d399ea5abcf5095aa84366a330514be0468b7f145443d1d38f689a9738d7b3978913f5fade713914401961d204bd825f47bc8d7d320febda44b509efb29921adfd7862af3d7f0abdc5666ab3fb44d3116f653d5bf96f2ddac7b4a4a3b88e49928d01bfa19b27d328820a60ec1f8225f7f432f9a9697a83a54cea06b29b3cf21b38b0d7dd27222a507f946f3f39ccbdca5ca2bb60b40f12f7ee72d7f683399b3","__v":0}

pbkdf2 hashing algorithm used
*/


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  //res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server running at port no. 8080");
});
