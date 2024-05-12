const express = require("express");
const router = express.Router();


// Index - users
router.get("/", (req, res)=>{
    res.send("GET for posts")
})

// show - users
router.get("/:id", (req, res)=>{
    res.send("GET for post id")
})

// post - users
router.get("/", (req, res)=>{
    res.send("POST for posts")
})

// DELETE - users
router.get("/:id", (req, res)=>{
    res.send("DELETE for post id")
})

module.exports = router