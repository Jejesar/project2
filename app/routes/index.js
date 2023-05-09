var express = require("express");
var router = express.Router();

const db = require("../functions/database");

/* GET home page. */
router.get("/", async (req, res, next) => {
  var [test] = await db.query("USE project2;");
  console.log(test);
  res.render("index", { title: test });
});

router.get("/about", async (req, res, next) => {
  res.render("about");
});

router.get("/dashboard", async (req, res, next) => {
  res.render("dashboard");
});

router.get("/history", async (req, res, next) => {
  res.render("history");
});

router.get("/edit", async (req, res, next) => {
  res.render("edit");
});

module.exports = router;
