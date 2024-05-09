// logic of initialization
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// 
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
/* app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

 */
const initDB = async()=>{
    // to clean the daa listing 
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();