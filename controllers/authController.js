const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

//handle errors
const handleErr = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "User Not Exist") {
    errors.email = "That Email is not registered";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Incorrect Password";
  }

  if (err.code === 11000) {
    //duplicate error code
    errors.email = "The email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "jwtSecret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

module.exports.login_get = (req, res) => {
  res.render("login", { title: "Log In" });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErr(err);
    res.status(404).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErr(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};