const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isOwner, isLoggedIn, isReviewAuthor} = require("../middleware.js")

// Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    // console.log(newReview);
    // console.log(listing);
    // console.log(Listing.reviews);
    newReview.author = req.user._id;
    //console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    //listing.reviews.push(newReview._id);
    await listing.save();

    // console.log("New revew saved");
    // res.send("new review saved")




    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
