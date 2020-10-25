const path = require("path");
const express = require("express");
const app = express();
const port = 65000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.render("index", { title: "Home" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
