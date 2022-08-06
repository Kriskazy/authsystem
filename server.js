const express = require("express");
const routes = require("./routes/userRoutes");
const { port, db } = require("./config");
const mongoose = require("mongoose");
// initialize express
const app = express();

// accept json and other form fields
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the database

mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("error in connection" + err);
    } else {
      console.log("mongodb is now connected");
    }
  }
);

// Api Routes
app.use("/", routes);

app.get("/user", verifyToken, roleChecker("user"), (req, res) => {
  res.send("Hello world, I am a user");
});

app.get("/admin", verifyToken, roleChecker("admin"), (req, res) => {
  res.send("Hello world, I am an admin");
});

app.get("/", (req, res) => {
  res.send("Hello Marlian");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
