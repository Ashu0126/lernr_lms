const express = require("express");
const { engine } = require("express/lib/application");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//app engine
app.set("view engine", "ejs");

//database connection
const dbURI =
  "mongodb+srv://node0123:node0123@nodetuts.rz4h3.mongodb.net/authLMS?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

//routes
app.get("*", checkUser);

app.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/task1", requireAuth, (req, res) => {
  res.render("course", { title: "Course" });
});

app.get("/task2", requireAuth, (req, res) => {
  res.render("course2", { title: "Course" });
});

app.get("/task3", requireAuth, (req, res) => {
  res.render("course3", { title: "Course" });
});

app.get("/task4", requireAuth, (req, res) => {
  res.render("course4", { title: "Course" });
});

app.get("/task5", requireAuth, (req, res) => {
  res.render("course5", { title: "Course" });
});

app.use(authRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Error 404" });
});
