const mongoose = require("mongoose");
const { Schema } = mongoose;
main()
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1/relationDemo");
}

const userSchema = new Schema({
  username: String,
  email: String,
});

const postSchema = new Schema({
  content: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const addData = async () => {
    /* let user1 = new User({
    username: "nasru",
    email: "nasru@gmail.com",
  }); */
  let user = await User.findOne({username: "nasru"});
  let post2 = new Post({
    content: "This is my second post",
    likes: 22,
    // user: user1._id
  });

  post2.user = user;

  /* await user1.save(); */
  await post2.save();
 
  let result = await Post.find().populate("user");
  console.log(result); 

};

addData();