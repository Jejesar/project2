var express = require("express");
var router = express.Router();

// ARDUINO READER
const arduino = require("../functions/arduino");

// DATABASE LINK
const db = require("../functions/database");
var dbConnection = false;

router.get("", async (req, res, next) => {
  res.json("API is working");
});

router.get("/get", async (req, res, next) => {
  var currentSequenceID, dataSequence;

  try {
    await db.ping();
    dbConnection = true;
  } catch (error) {
    dbConnection = false;
    return res.status(500).json({ error: error, dbConnection: dbConnection });
  }

  try {
    var [currentSequenceID] = await db.query(
      `SELECT idSequence as id FROM currentSequence`
    );

    if (currentSequenceID[0].id == null) {
      return res.json({
        currentSequenceID: null,
        dbConnection: dbConnection,
      });
    }

    if (currentSequenceID) {
      var [dataSequence] = await db.query(
        `SELECT * FROM listSequences WHERE idSequence=?`,
        currentSequenceID[0].id
      );
    }
  } catch (error) {
    return res.status(500).json({ error: error, dbConnection: dbConnection });
  }

  res.json({
    currentSequenceID: currentSequenceID[0].id,
    dbConnection: dbConnection,
    dataSequence: dataSequence,
  });
});

router.get("/get/all", async (req, res, next) => {
  try {
    var [allSequences] = await db.query("SELECT * FROM listSequences");
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  res.json(allSequences);
});

router.get("/get/last", async (req, res, next) => {
  try {
    var [lastSequence] = await db.query(
      `SELECT * FROM listSequences WHERE idSequence = (SELECT max(idSequence) FROM listSequences);`
    );

    res.json(lastSequence[0]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/get/measures", async (req, res, next) => {
  try {
    var [measures] = await db.query("SELECT * FROM measures");
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  res.json(measures);
});

router.get("/get/:id", async (req, res, next) => {
  var [selectedSequences] = await db.query(
    "SELECT * FROM listSequences JOIN currentSequence ON currentSequence.idSequence = listSequences.idSequence WHERE listSequences.idSequence = ?",
    req.params.id
  );
  res.json(selectedSequences[0]);
});

router.post("/create", async (req, res, next) => {
  await db
    .query("INSERT INTO listSequences (name, comment) VALUES (NULL, NULL)")
    .then(async ([result]) => {
      await db.query(
        "UPDATE currentSequence SET idSequence=?",
        result.insertId
      );
    });
  res.json("OK");
});

router.post("/edit/:id", async (req, res, next) => {
  var { sequenceName, sequenceComment } = req.body;

  try {
    var [editedSequence] = await db.query(
      "UPDATE `listSequences` SET `name`=?,`comment`=? WHERE idSequence=?",
      [sequenceName, sequenceComment, Number(req.params.id)]
    );
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  res.json("OK");
});

router.post("/insert/:type", async (req, res, next) => {
  var measure = req.params.type;
  var [currentSequence] = await db.query(
    "SELECT idSequence FROM currentSequence"
  );

  if (currentSequence[0]) {
    db.query(
      "UPDATE listSequences SET measure? = measure? + 1",
      Number(measure)
    );

    res.json("OK");
  } else {
    res.status(404).json("Sequence not found");
  }
});

router.post("/select/last", async (req, res, next) => {
  await db.query(
    "UPDATE currentSequence SET idSequence=(SELECT MAX(idSequence) FROM listSequences);"
  );
  res.json("OK");
});

router.post("/stop", async (req, res, next) => {
  await db.query(`UPDATE currentSequence SET idSequence=NULL;`);
  res.json("OK");
});

router.delete("/delete/:id", async (req, res, next) => {
  await db.query(`DELETE FROM listSequences WHERE idSequence=?`, req.params.id);
  res.json("OK");
});

router.post("/shutdown", async (req, res, next) => {
  process.exit(0);
});

module.exports = router;
