const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


module.exports.createListing = async (req, res, next) => {
  try {
    // Perform geocoding
    const geocodingResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    // Check if location was found
    if (!geocodingResponse.body.features.length) {
      throw new Error('Location not found');
    }

    // Extract geometry from geocoding response
    const geometry = geocodingResponse.body.features[0].geometry;

    // Ensure the image fields are correctly set
    const image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    // Debug logs to ensure values are correct
    console.log('Geometry:', geometry);
    console.log('Image:', image);
    console.log('Listing Data:', req.body.listing);

    // Create the new listing object with all required fields
    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: image,
      geometry: geometry,
    });

    // Save the new listing to the database
    await newListing.save();

    // Redirect to the listings page after successful save
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
};
/* 
module.exports.createListing = async (req, res, next) => {
  try {
    let geocodingResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 2,
      })
      .send();
    
    // Check if location was found
    if (!geocodingResponse.body.features.length) {
      throw new Error("Location not found");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    /*  //let {title, description, image, price, country, location} = req.body;
    let listing = req.body.listing;// instead of above we can also write like this
    console.log(listing);
     */
    /* if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
      } 

    const newListing = await Listing.create(req.body.listing);
    /* if(!newListing.title){
        throw new ExpressError(400, "Title is missing");
      }
      if(!newListing.description){
        throw new ExpressError(400, "Description is missing");
      }
      if(!newListing.location){
        throw new ExpressError(400, "Location is missing");
      } 
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = geocodingResponse.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
 */
module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
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
