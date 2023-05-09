const ctx = document.getElementById("myChart");

const badgeDatabase = document.getElementById("badge-database");
const txtCurrentSequence = document.getElementById("current-sequence-id");
const txtStartedTime = document.getElementById("started-time");
const txtLastSequence = document.getElementById("last-sequence");
const divLastSequence = document.getElementById("last-sequence-footer");

const btnStart = document.getElementById("btn-start");
const btnStartNew = document.getElementById("btn-start-new");
const btnStartLast = document.getElementById("btn-start-last");
const btnStop = document.getElementById("btn-stop");

var data = {
  labels: ["Measure 1", "Measure 2", "Measure 3", "Measure 4", "Measure 5"],
  datasets: [
    {
      label: "Waiting to start...",
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        "rgba(255, 118, 117,0.2)",
        // "rgba(250, 177, 160,0.2)",
        "rgba(255, 234, 167,0.2)",
        "rgba(85, 239, 196,0.2)",
        // "rgba(129, 236, 236,0.2)",
        "rgba(116, 185, 255,0.2)",
        "rgba(162, 155, 254,0.2)",
      ],
      borderColor: [
        "rgba(255, 118, 117,1.0)",
        // "rgba(250, 177, 160,1.0)",
        "rgba(255, 234, 167,1.0)",
        "rgba(85, 239, 196,1.0)",
        // "rgba(129, 236, 236,1.0)",
        "rgba(116, 185, 255,1.0)",
        "rgba(162, 155, 254,1.0)",
      ],
      borderWidth: 2,
      borderRadius: 10,
    },
  ],
};

const myChart = new Chart(ctx, {
  type: "bar",
  data: data,
  options: {
    indexAxis: "x",
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  },
});

setInterval(() => {
  //   checkSequence();
  //   randomSequence();
  myChart.update();
}, 1000);

const randomSequence = () => {
  var random = [];

  for (let i = 0; i < 7; i++) {
    random[i] = Math.floor(Math.random() * 10);
  }

  data.datasets[0].data = [...random];
};

// const uploadRandom = (random) => {
//   console.log(data.datasets[0].data);

//   let info = [];
//   info[0] = data.datasets[0].data[0];

//   $.ajax({
//     type: "post",
//     url: "/api/edit/2",
//     data: { test: "test", info: info },
//     dataType: "JSON",
//     success: (res) => {},
//   });
// };

setInterval(() => {
  $.ajax({
    type: "GET",
    url: "/api/get",
    dataType: "JSON",
    success: (res) => {
      if (res.dataSequence) {
        data.datasets[0].data[0] = res.dataSequence[0].measure1;
        data.datasets[0].data[1] = res.dataSequence[0].measure2;
        data.datasets[0].data[2] = res.dataSequence[0].measure3;
        data.datasets[0].data[3] = res.dataSequence[0].measure4;
      } else {
        data.datasets[0].data = [0, 0, 0, 0];
      }

      myChart.update();

      if (res.dbConnection === true) {
        $(badgeDatabase).removeClass("bg-warning");
        $(badgeDatabase).addClass("bg-success");
        $(badgeDatabase).text("Database connected");
      } else {
        $(badgeDatabase).removeClass("bg-success");
        $(badgeDatabase).addClass("bg-warning");
        $(badgeDatabase).text("Database disconnected");
      }

      if (res.currentSequenceID) {
        $(txtCurrentSequence).text(res.currentSequenceID);
        $(btnStart).addClass("disabled");
        $(btnStop).removeClass("disabled");
        $(divLastSequence).removeAttr("hidden");
      } else {
        $(txtCurrentSequence).text("...");
        $(btnStart).removeClass("disabled");
        $(btnStop).addClass("disabled");
        $(divLastSequence).attr("hidden", "");
      }
    },
  });

  $.ajax({
    type: "GET",
    url: "/api/get/last",
    dataType: "JSON",
    success: (res) => {
      $(txtLastSequence).text(res.idSequence);
      $(txtStartedTime).text(new Date(res.createdTimestamp).toLocaleString());
    },
  });
}, 1000);

$(btnStartNew).click((e) => {
  $.ajax({
    type: "POST",
    url: "/api/create",
  });
});

$(btnStartLast).click((e) => {
  $.ajax({
    type: "POST",
    url: "/api/select/last",
  });
});

$(btnStop).click((e) => {
  $.ajax({
    type: "POST",
    url: "/api/stop",
  });
});
