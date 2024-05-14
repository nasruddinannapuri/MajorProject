const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js")

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
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

  req.flash("success", "New Listing Created!");
  res.redirect("listings");
};

module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let delVal = await Listing.findByIdAndDelete(id);
  console.log(delVal);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing, currUser: req.user });
};
