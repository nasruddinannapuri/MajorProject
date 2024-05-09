// database schema and model designing

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    fileName:{
        type: String
    },
    url:{
        type: String,
    // set the default value ==> mongoosh-virtual-setfunction for set value
    default: "https://miro.medium.com/v2/resize:fit:2400/0*hDAyhnOx767w5qma.jpg",
    set: (v) =>
      v === ""
        ? "https://miro.medium.com/v2/resize:fit:2400/0*hDAyhnOx767w5qma.jpg"
        : v,
    },
  },
    
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
