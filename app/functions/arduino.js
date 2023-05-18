// DATABASE LINK
const db = require("../functions/database");
var dbConnection = false;

// ARDUINO LINK DATA
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

var oldArduinoData;
var measured = 0;
var measuredArray = [];
var receivedTime;
var measuredMax = 0;
parser.on("data", async (data) => {
  if (oldArduinoData != data) {
    oldArduinoData = data;

    if (data.startsWith("Measure :")) {
      measured = Number(data.split(`"`)[1]);
      if (measuredArray.length == 0) receivedTime = new Date();
      measuredArray.push(measured);
      measuredMax = Math.max(measuredMax, measured);
      console.log(measuredMax, receivedTime);
    }

    if (data == "RESET") {
      var [currentSequence] = await db.query(
        "SELECT idSequence FROM currentSequence"
      );
      currentSequence = currentSequence[0].idSequence;

      var measuredType =
        measuredMax >= 9.5
          ? 5
          : measuredMax >= 8.5
          ? 4
          : measuredMax >= 7.5
          ? 3
          : measuredMax >= 6.5
          ? 2
          : measuredMax >= 5.5
          ? 1
          : 0;

      if (currentSequence && measuredArray.length > 0) {
        db.query(
          `UPDATE listSequences
            JOIN (SELECT MAX(idSequence) AS maxID FROM listSequences) AS list2
            ON idSequence = list2.maxID
            SET measure? = measure? + 1`,
          [Number(measuredType), Number(measuredType)]
        );

        db.query(
          `INSERT INTO measures (idSequence, typeOf)
          VALUES
          (?, ?)`,
          [currentSequence, measuredType]
        );
      } else if (measuredArray.length > 0) {
        db.query(
          `INSERT INTO measures (typeOf)
            VALUES
            (?)`,
          measuredType
        );
      }

      console.log(currentSequence, measuredType, measuredMax);
      measuredArray = [];
      measuredMax = 0;
    }
  }

  // if (data.toLowerCase().startsWith("measure")) {
  //   // Message expected : `Measure : "[value]"`

  //   measuredType = data.split(`"`)[1];

  //   var [currentSequence] = await db.query(
  //     "SELECT idSequence FROM currentSequence"
  //   );

  //   if (currentSequence[0].idSequence) {
  //     db.query(
  //       `UPDATE listSequences
  //       JOIN (SELECT MAX(idSequence) AS maxID FROM listSequences) AS list2
  //       ON idSequence = list2.maxID
  //       SET measure? = measure? + 1`,
  //       [Number(measuredType), Number(measuredType)]
  //     );
  //   }

  //   console.log(
  //     "Current sequence : " +
  //       currentSequence[0].idSequence +
  //       "\tType : " +
  //       measuredType
  //   );
  // } else if (data.toLowerCase().startsWith("reset")) {
  //   // Message expected : `RESET`

  //   measuredType = null;
  // }
});
