// index.js
// logic of initialization
const express = require("express");
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Database is connected");
    // After connecting to the database, initialize the data
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Delete all documents from the Listing collection
    await Listing.deleteMany({});
    // Insert new data into the Listing collection
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

// Endpoint to manually reinitialize data
app.get("/reinitialize-data", async (req, res) => {
  try {
    await initDB();
    res.send("Data reinitialized successfully");
  } catch (err) {
    console.error("Error reinitializing data:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Other routes and middleware definitions go here...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
