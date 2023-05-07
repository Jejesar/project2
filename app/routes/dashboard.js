var express = require("express");
var router = express.Router();

const db = require("../functions/database");

var dbConnection = false;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("dashboard");
});

router.get("/api", async (req, res, next) => {
  res.json("respond with a resource");
});

router.get("/api/get/current", async (req, res, next) => {
  var currentSequenceID;

  try {
    await db.ping();
    dbConnection = true;

    var [currentSequenceID] =
      await db.query(`SELECT idSequence as id, createdTimestamp
    FROM listSequences 
    WHERE createdTimestamp = (SELECT MAX(createdTimestamp) FROM listSequences)
    `);

    // console.log(currentSequenceID);
  } catch (error) {
    dbConnection = false;
  }

  res.json({
    currentSequenceID: currentSequenceID[0].id,
    dbConnection: dbConnection,
    startedTimestamp: currentSequenceID[0].createdTimestamp,
  });
});

router.get("/api/get/all", async (req, res, next) => {
  var [allSequences] = await db.query(
    "SELECT listSequences.idSequence, name, comment, 0cm as cm0, 2cm as cm2, 4cm as cm4, 6cm as cm6, createdTimestamp FROM listSequences JOIN currentSequence ON currentSequence.idSequence = listSequences.idSequence"
  );
  res.json(allSequences);
});

router.get("/api/get/:id", async (req, res, next) => {
  var [selectedSequences] = await db.query(
    "SELECT listSequences.idSequence, name, comment, 0cm as cm0, 2cm as cm2, 4cm as cm4, 6cm as cm6 FROM listSequences JOIN currentSequence ON currentSequence.idSequence = listSequences.idSequence WHERE listSequences.idSequence = ?",
    req.params.id
  );
  res.json(selectedSequences[0]);
});

router.post("/api/create", async (req, res, next) => {
  await db
    .query("INSERT INTO listSequences (name, comment) VALUES (NULL, NULL)")
    .then(async ([result]) => {
      console.log(result.insertId);
      await db.query(
        "INSERT INTO currentSequence(`idSequence`) VALUES (?)",
        result.insertId
      );
    });
  res.json("OK");
});

router.post("/api/edit/:id", async (req, res, next) => {
  var data = req.body;
  console.log(data);
  //   await db.query(
  //     "UPDATE currentSequence SET `0cm` = ? WHERE idSequence = ?",
  //     data[0],
  //     req.params.id
  //   );
});

router.post("/api/insert/:type", async (req, res, next) => {});

module.exports = router;
