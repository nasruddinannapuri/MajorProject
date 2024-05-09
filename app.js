//1) require the libraries, packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MajorProject/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", {allListings});
});


// New Route
/* 
  new route will be kept above the show route 
  because the show route will imagine that new
  is a id then it will search in db for any new 
  is present or not that the problem facing.
*/
app.get("/listings/new",(req, res)=>{
  res.render("listings/new.ejs");

})

// create route - to accept the post request
app.post("/listings", async (req, res)=>{
  //
 /*  //let {title, description, image, price, country, location} = req.body;
  let listing = req.body.listing;// instead of above we can also write like this
  console.log(listing);
   */
  let newListing = await Listing.create(req.body.listing);
  await newListing.save();
  res.redirect("listings");
  
})

// Edit Route
app.get("/listings/:id/edit", async (req, res)=>{
  let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

// Update Route
app.put("/listings/:id",async (req, res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id", async (req, res)=>{
  let {id} = req.params;
  let delVal = await Listing.findByIdAndDelete(id);
  console.log(delVal)
  res.redirect("/listings");
})

// Show Route
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});

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
app.listen(8080, () => {
  console.log("Server running at port no. 8080");
});
