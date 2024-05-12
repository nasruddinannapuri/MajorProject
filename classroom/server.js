const express = require("express");
const app = express();
const users = require("./routes/users.js")
const posts = require("./routes/posts.js")
const cookieParser = require("cookie-parser")

// every request goes through this cookiesparser middleware only
app.use(cookieParser("secretmessage"));

app.use("/getsignedcookie", (req, res)=>{
    res.cookie("made-in", "India",{signed: true})
    res.send("signed cookie sent");
})

app.use("/verify", (req, res)=>{
    //console.log(req.cookies);
    // normally it will print only unsigned cookies 
    // to print the unsigned alos use the req.signedCookies
    console.log(req.signedCookies) // signed cookies will print

    res.send("verified");
})

/* 
if you changed the value of signed cookie in signedcookie route,then it 
will show as a false not empty list 
[Object: null prototype] { 'made-in': false }
but in normal if you changed/ modify in verify route, then it will 
shows the empty list or if you change entire value 

[Object: null prototype] {}



if you change entire value in the signed cookie/ verify route it will return the empty item
[Object: null prototype] {}

if you change only value in the signed cookie/ verify route then it will
returns the 
[Object: null prototype] { 'made-in': false }


*/


app.get("/getcookies", (req, res)=>{
    res.cookie("name", "express") // cookies sending from the server
    // name , value pair
    // res.cookie("name", "express", {expire: 36000 + Date.now()});
    res.send("cookie send");
})

app.get("/greet",(req, res)=>{
    let {name = "anonymous"} = req.cookies
    res.send(`Hi, ${name}`)
})

app.get("/", (req, res)=>{
    console.dir(req.cookies);
    res.send("Hi, I am root!");
})

app.use("/users",users);
app.use("/posts",posts);
// USERS




// POSTS




app.listen(3000,()=>{
    console.log("server is running on port 3000");
})