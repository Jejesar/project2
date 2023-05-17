// const moment = require("moment");

const table = document.getElementById("table");
const tableList = document.getElementById("table-list-sequences");

var rows = [];
var previousSize = 0;

// setInterval(() => {
checkHistory();
if (rows.length != previousSize) {
  tableList.innerHTML = "";
  renderTable();
  previousSize = rows.length;
}
// }, 5000);

const checkHistory = async () => {
  await $.ajax({
    type: "get",
    url: "/api/get/all",
    success: (res) => {
      // console.log(res);
      rows = res;
    },
  });
};

$.ajax({
  type: "get",
  url: "/api/get/all",
  success: (res) => {
    // console.log(res);
    rows = res;
  },
}).then(() => renderTable());

const renderTable = () => {
  var rowHTML = "";
  rows.forEach((row) => {
    // console.log(row);
    var currentRow = document.createElement("tr");

    // rowHTML += `<tr>
    //   <td>${row.idSequence}</td>
    //   <td>${row.name}</td>
    //   <td>${new Date(row.createdTimestamp).toLocaleString()}</td>
    //   <td>${row.measure1}</td>
    //   <td>${row.measure2}</td>
    //   <td>${row.measure3}</td>
    //   <td>${row.measure4}</td>
    //   <td>${row.comment}</td>
    //   <td>
    //     <button onclick="edit(${
    //       row.idSequence
    //     })" class="btn btn-dark btn-sm bg-dark text-white mx-1 my-1">
    //       <i class="fa fa-pencil" aria-hidden="true"></i>
    //     </button>
    //     <button onclick="del(${
    //       row.idSequence
    //     })" class="btn btn-dark btn-sm bg-dark text-white mx-1 my-1">
    //       <i class="fa fa-trash" aria-hidden="true"></i>
    //     </button>
    //   </td>
    // </tr>`;

    var idSequence = document.createElement("td");
    idSequence.innerText = row.idSequence;
    currentRow.appendChild(idSequence);

    var name = document.createElement("td");
    name.innerText = row.name;
    currentRow.appendChild(name);

    var createdAt = document.createElement("td");
    createdAt.innerText = new Date(row.createdTimestamp).toLocaleString();
    currentRow.appendChild(createdAt);

    var measure0 = document.createElement("td");
    measure0.innerText = row.measure0;
    currentRow.appendChild(measure0);

    var measure1 = document.createElement("td");
    measure1.innerText = row.measure1;
    currentRow.appendChild(measure1);

    var measure2 = document.createElement("td");
    measure2.innerText = row.measure2;
    currentRow.appendChild(measure2);

    var measure3 = document.createElement("td");
    measure3.innerText = row.measure3;
    currentRow.appendChild(measure3);

    var measure4 = document.createElement("td");
    measure4.innerText = row.measure4;
    currentRow.appendChild(measure4);

    var measure5 = document.createElement("td");
    measure5.innerText = row.measure5;
    currentRow.appendChild(measure5);

    var comment = document.createElement("td");
    comment.innerText = row.comment;
    currentRow.appendChild(comment);

    var btnCol = document.createElement("td");
    $(btnCol).html(`
    <button onclick="edit(${row.idSequence})" class="btn btn-dark btn-sm bg-dark text-white mx-1 my-1">
      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
    </button>
    <button onclick="del(${row.idSequence})" class="btn btn-dark btn-sm bg-dark text-white mx-1 my-1">
      <i class="fas fa-trash" aria-hidden="true"></i>
    </button>
    `);
    currentRow.appendChild(btnCol);

    $(tableList).prepend(currentRow); // Rerversed .append
  });
  // $(tableList).html(rowHTML);
};

const del = async (id) => {
  $.ajax({
    type: "DELETE",
    url: `/api/delete/${id}`,
    success: () => {
      rows = [];
      $(tableList).empty();
    },
  });

  await checkHistory();
  renderTable();
};

const edit = async (id) => {
  document.location = `/edit/${id}`;
};
