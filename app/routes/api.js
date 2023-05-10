var express = require("express");
var router = express.Router();

// ARDUINO LINK DATA
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
// const port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });

// const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

var oldArduinoData;
var measuredType;
// parser.on("data", async (data) => {
//   if (oldArduinoData != data) {
//     oldArduinoData = data;

//     if (data.toLowerCase().startsWith("measure")) {
//       // Message expected : `Measure : "[value]"`

//       measuredType = data.split(`"`)[1];

//       var [currentSequence] = await db.query(
//         "SELECT idSequence FROM currentSequence"
//       );

//       if (currentSequence[0].idSequence) {
//         db.query(
//           `UPDATE listSequences
//           JOIN (SELECT MAX(idSequence) AS maxID FROM listSequences) AS list2
//           ON idSequence = list2.maxID
//           SET measure? = measure? + 1`,
//           [Number(measuredType), Number(measuredType)]
//         );
//       }

//       console.log(
//         "Current sequence : " +
//           currentSequence[0].idSequence +
//           "\tType : " +
//           measuredType
//       );
//     } else if (data.toLowerCase().startsWith("reset")) {
//       // Message expected : `RESET`

//       measuredType = null;
//     }
//   }
// });

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
  }

  try {
    var [currentSequenceID] = await db.query(
      `SELECT idSequence as id FROM currentSequence`
    );
  } catch (error) {}

  try {
    if (currentSequenceID) {
      var [dataSequence] = await db.query(
        `SELECT * FROM listSequences WHERE idSequence=?`,
        currentSequenceID[0].id
      );
    }
  } catch (error) {}

  res.json({
    currentSequenceID: currentSequenceID[0].id,
    dbConnection: dbConnection,
    dataSequence: dataSequence,
  });
});

router.get("/get/all", async (req, res, next) => {
  var [allSequences] = await db.query("SELECT * FROM listSequences");

  res.json(allSequences);
});

router.get("/get/last", async (req, res, next) => {
  var [lastSequence] = await db.query(
    `SELECT * FROM listSequences WHERE idSequence = (SELECT max(idSequence) FROM listSequences);`
  );

  res.json(lastSequence[0]);
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
      console.log(result.insertId);
      await db.query(
        "UPDATE currentSequence SET idSequence=?",
        result.insertId
      );
    });
  res.json("OK");
});

router.post("/edit/:id", async (req, res, next) => {
  var data = req.body;
  console.log(data);
  //   await db.query(
  //     "UPDATE currentSequence SET `0cm` = ? WHERE idSequence = ?",
  //     data[0],
  //     req.params.id
  //   );
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

module.exports = router;
