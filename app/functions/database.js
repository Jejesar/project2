// const mysql = require("mysql2");
// var db;

// try {
//   db = mysql
//     .createConnection({
//       host: "localhost",
//       user: "root",
//       password: "password",
//       database: "project2",
//     })
//     .promise();
// } catch (error) {
//   console.error("Database connection error");
// }

// module.exports = db;

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "db",
  user: "root",
  password: "password",
  database: "project2",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

db.on("error", (err) => {
  console.error("Database error:", err);
});

module.exports = db.promise();
