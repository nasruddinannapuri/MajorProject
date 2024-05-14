const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})
router
  .route("/")
  .get(wrapAsync(listingController.index))
  /* .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  ); */
  .post(upload.single('listing[image]'),(req, res)=>{
    res.send(req.file);
  })
// New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditFrom)
);
module.exports = router;

// Index Route
//router.get("/", wrapAsync(listingController.index));

// New Route

/* new route will be kept above the show route 
    because the show route will imagine that new
    is a id then it will search in db for any new 
    is present or not that the problem facing. */

// router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// create route - to accept the post request
/* router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);
 
// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditFrom)
);
/* 
// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));
 */
