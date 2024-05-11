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
  addresses: [
    {
      _id: false, // if we set this then doesn't create the
      // saperate id for this object also.
      location: String,
      city: String,
    },
  ],
});

// one to many- Approach2(one to few example):
const User = mongoose.model("User", userSchema);

const addUser = async () => {
  let user1 = new User({
    username: "John",
    addresses: [{ location: "Mulapet", city: "Nellore" }],
  });
  user1.addresses.push({ location: "Builtop", city: "Cuddapah" });
  let result = await user1.save();
  console.log(result);
};

addUser();

/*  Output:
Connection successful!
{
  username: 'John',
  addresses: [
    { location: 'Mulapet', city: 'Nellore' },
    { location: 'Builtop', city: 'Cuddapah' }
  ],
  _id: new ObjectId('663f50ea739b19e946c2ce8a'),      
  __v: 0
}
*/
