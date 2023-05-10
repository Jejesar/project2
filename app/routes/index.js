var express = require("express");
var router = express.Router();

const db = require("../functions/database");

/* GET home page. */
router.get("/", async (req, res, next) => {
  // var [test] = await db.query("USE project2;");
  // console.log(test);
  res.render("index", { title: "Home page | Project 2" });
});

router.get("/about", async (req, res, next) => {
  res.render("about", { title: "About page | Project 2" });
});

router.get("/dashboard", async (req, res, next) => {
  res.render("dashboard", { title: "Dashboard page | Project 2" });
});

router.get("/history", async (req, res, next) => {
  res.render("history", { title: "History page | Project 2" });
});

router.get("/edit", async (req, res, next) => {
  res.render("edit", { title: "Edit page | Project 2" });
});

module.exports = router;
