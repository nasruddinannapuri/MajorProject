// database schema and model designing

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    fileName: {
      type: String,
    },
    url: {
      type: String,
      // set the default value ==> mongoosh-virtual-setfunction for set value
      default:
        "https://miro.medium.com/v2/resize:fit:2400/0*hDAyhnOx767w5qma.jpg",
      set: (v) =>
        v === ""
          ? "https://miro.medium.com/v2/resize:fit:2400/0*hDAyhnOx767w5qma.jpg"
          : v,
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
