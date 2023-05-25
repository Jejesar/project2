const mysql = require("mysql2");

// Link to the database
const db = mysql.createConnection({
  host: "db",
  user: "root",
  password: "password",
  database: "project2",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

// Error bad (smiley crying)
db.on("error", (err) => {
  console.error("Database error:", err);
});

// Export the const "db" to use it in the APIu;
module.exports = db.promise();
