const ctx = document.getElementById("myChart");

const badgeDatabase = document.getElementById("badge-database");
const txtCurrentSequence = document.getElementById("current-sequence-id");
const txtStartedTime = document.getElementById("started-time");

const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");

var data = {
  labels: ["0cm", "1cm", "2cm", "3cm", "4cm", "5cm", "6cm"],
  datasets: [
    {
      label: "Waiting to start...",
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: [
        "rgba(255, 118, 117,0.2)",
        "rgba(250, 177, 160,0.2)",
        "rgba(255, 234, 167,0.2)",
        "rgba(85, 239, 196,0.2)",
        "rgba(129, 236, 236,0.2)",
        "rgba(116, 185, 255,0.2)",
        "rgba(162, 155, 254,0.2)",
      ],
      borderColor: [
        "rgba(255, 118, 117,1.0)",
        "rgba(250, 177, 160,1.0)",
        "rgba(255, 234, 167,1.0)",
        "rgba(85, 239, 196,1.0)",
        "rgba(129, 236, 236,1.0)",
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
  uploadRandom(data.datasets[0].data);
};

// const uploadRandom = (random) => {
//   console.log(data.datasets[0].data);

//   let info = [];
//   info[0] = data.datasets[0].data[0];

//   $.ajax({
//     type: "post",
//     url: "/dashboard/api/edit/2",
//     data: { test: "test", info: info },
//     dataType: "JSON",
//     success: (res) => {},
//   });
// };

setInterval(() => {
  $.ajax({
    type: "GET",
    url: "/dashboard/api/get/current",
    dataType: "json",
    success: (res) => {
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
        $(txtStartedTime).text(new Date(res.startedTimestamp).toLocaleString());
      } else {
        $(txtCurrentSequence).text("...");
        $(txtStartedTime).text("...");
      }
    },
  });
}, 1000);

$(btnStart).click((e) => {
  console.log("Click");
});
