// DATABASE LINK
const db = require("../functions/database");
var dbConnection = false;

// ARDUINO LINK DATA
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
// Define SerialPort device and delimiter
const port = new SerialPort({ path: "/dev/ttyACM0", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

var oldArduinoData;
var measured = 0;
var measuredArray = [];
var measuredMax = 0;

// Arduino sending data to Raspberry
parser.on("data", async (data) => {
  // Keep only new data
  if (oldArduinoData != data) {
    oldArduinoData = data;

    // Especting message from Arduino (Measure : "[value in cm)")
    if (data.startsWith("Measure :")) {
      // Select only [value in cm]
      measured = Number(data.split(`"`)[1]);
      console.log(data);

      // Stock measures in an array and keep only the biggest in MAX
      measuredArray.push(measured);
      measuredMax = Math.max(measuredMax, measured);
    }

    // No measure coming from the Arduino
    if (data == "RESET") {
      // Select current sequence
      var [currentSequence] = await db.query(
        "SELECT idSequence FROM currentSequence"
      );
      currentSequence = currentSequence[0].idSequence;

      // if else which choose the measured depth from the data
      var measuredType =
        measuredMax > 9.5
          ? 5
          : measuredMax > 8.5
          ? 4
          : measuredMax > 7.5
          ? 3
          : measuredMax > 6.5
          ? 2
          : measuredMax > 5.5
          ? 1
          : 0;

      // Check if we got measures and if a sequence is selected
      if (currentSequence && measuredArray.length > 0) {
        // Add measure to the sequence list database
        db.query(
          `UPDATE listSequences
            JOIN (SELECT MAX(idSequence) AS maxID FROM listSequences) AS list2
            ON idSequence = list2.maxID
            SET measure? = measure? + 1`,
          [Number(measuredType), Number(measuredType)]
        );

        // Add measure to the measure database history
        db.query(
          `INSERT INTO measures (idSequence, typeOf)
          VALUES
          (?, ?)`,
          [currentSequence, measuredType]
        );
      } else if (measuredArray.length > 0) {
        // Add measure to the measure database history whithout current sequence
        db.query(
          `INSERT INTO measures (typeOf)
            VALUES
            (?)`,
          measuredType
        );
      }

      // Log the data for debugging
      console.log(
        `Sequence ${currentSequence}, Mesure ${measuredType}, Max ${measuredMax}`
      );

      // Reset the array of measures received
      measuredArray = [];
      measuredMax = 0;
    }
  }
});
