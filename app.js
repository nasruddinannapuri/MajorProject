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
