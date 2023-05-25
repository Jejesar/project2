var express = require("express");
var router = express.Router();

const db = require("../functions/database");

/* Render pages */

// Index page
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Home page | Project 2" });
});

// About page
router.get("/about", async (req, res, next) => {
  res.render("about", { title: "About page | Project 2" });
});

// Dashboard page
router.get("/dashboard", async (req, res, next) => {
  res.render("dashboard", { title: "Dashboard page | Project 2" });
});

// History page
router.get("/history", async (req, res, next) => {
  res.render("history", { title: "History page | Project 2" });
});

// Edit form page
router.get("/edit/:id", async (req, res, next) => {
  res.render("edit", {
    title: "Edit page | Project 2",
    idSequence: req.params.id,
  });
});

// All measures page
router.get("/real-time", async (req, res, next) => {
  res.render("realTime", { title: "Real time measures | Project 2" });
});

module.exports = router;
