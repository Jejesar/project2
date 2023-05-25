// Importations of elements from the web page
const badgeDatabase = document.getElementById("badge-database");
const bodyPage = document.getElementsByClassName("container")[0];

const btnShutdown = document.getElementById("btn-shutdown");

// Check every seconds the connection to the database
setInterval(() => {
  $.ajax({
    type: "GET",
    url: "/api/get",
    dataType: "JSON",
    success: (res) => {
      if (res.dbConnection === true) {
        $(badgeDatabase).removeClass("bg-warning");
        $(badgeDatabase).addClass("bg-success");
        $(badgeDatabase).text("Database connected");
      } else {
        $(badgeDatabase).removeClass("bg-success");
        $(badgeDatabase).addClass("bg-warning");
        $(badgeDatabase).text("Database disconnected");
      }
    },
  });
}, 1000);

// Reboot the web server when clicked
$(btnShutdown).click((e) => {
  console.log("REBOOT");
  $.ajax({
    type: "POST",
    url: "/api/shutdown",
  });
});
