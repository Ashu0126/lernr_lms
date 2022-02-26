const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Minimum password length is 6 character"],
  },
});

//fire a function after doc saved to db
// userSchema.post("save", function (doc, next) {
//   console.log("New User created", doc);
//   next();
// });

//fire a function after doc to dc
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login
userSchema.statics.login = async function (email, password) {
  const User = await this.findOne({ email });
  if (User) {
    const auth = await bcrypt.compare(password, User.password);
    if (auth) {
      return User;
    }
    throw Error("Incorrect password");
  }
  throw Error("User Not Exist");
};

const user = mongoose.model("user", userSchema);

module.exports = user;
