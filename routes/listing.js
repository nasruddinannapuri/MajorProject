const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")




// Index Route
router.get(
  "/",
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
router.get(
  "/new",
  isLoggedIn,
  wrapAsync((req, res) => {
    res.render("listings/new.ejs");
  })
);

// create route - to accept the post request
router.post(
  "/",
  isLoggedIn,
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
    newListing.owner = req.user._id;
    await newListing.save();
    
    req.flash("success", "New Listing Created!")
    res.redirect("listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delVal = await Listing.findByIdAndDelete(id);
    console.log(delVal);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
  }) 
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

    if(!listing){
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing, currUser: req.user });
  })
);


module.exports = router;
