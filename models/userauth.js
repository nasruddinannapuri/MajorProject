const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        //unique: true
    },
    // user, and password automatically store by passportlocalmongoose

})

UserSchema.plugin(passportLocalMongoose);
// username, hasing salting and hash password will automatically implemented
module.exports = mongoose.model("User", UserSchema);