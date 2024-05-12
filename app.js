//1) require the libraries, packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MajorProject/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");
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

app.get(
  "/",
  wrapAsync((req, res) => {
    res.send("Hi, I am root");
  })
);
// Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
/* 
  new route will be kept above the show route 
  because the show route will imagine that new
  is a id then it will search in db for any new 
  is present or not that the problem facing.
*/
app.get(
  "/listings/new",
  wrapAsync((req, res) => {
    res.render("listings/new.ejs");
  })
);

// middleware of validation schema using joi
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
// create route - to accept the post request
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //
    /*  //let {title, description, image, price, country, location} = req.body;
  let listing = req.body.listing;// instead of above we can also write like this
  console.log(listing);
   */
    /* if(!req.body.listing){
      throw new ExpressError(400, "Send valid data for listing");
    } */

    const newListing = await Listing.create(req.body.listing);
    /* if(!newListing.title){
      throw new ExpressError(400, "Title is missing");
    }
    if(!newListing.description){
      throw new ExpressError(400, "Description is missing");
    }
    if(!newListing.location){
      throw new ExpressError(400, "Location is missing");
    } */
    await newListing.save();
    res.redirect("listings");
  })
);

// Edit Route
app.get(
  "/listings/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delVal = await Listing.findByIdAndDelete(id);
    console.log(delVal);
    res.redirect("/listings");
  })
);

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// Reviews
// Post Review Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // console.log(newReview);
    // console.log(listing);
    // console.log(Listing.reviews);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New revew saved");
    // res.send("new review saved")
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);
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
