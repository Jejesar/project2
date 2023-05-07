// const moment = require("moment");

const tableList = document.getElementById("table-list-sequences");

var rows = [];
var previousSize = 0;

setInterval(() => {
  checkHistory();
  if (rows.length != previousSize) {
    tableList.innerHTML = "";
    renderTable();
    previousSize = rows.length;
  }
}, 5000);

const checkHistory = async () => {
  $.ajax({
    type: "get",
    url: "http://localhost:3000/dashboard/api/get/all",
    success: (res) => {
      // console.log(res);
      rows = res;
    },
  });
};

$.ajax({
  type: "get",
  url: "http://localhost:3000/dashboard/api/get/all",
  success: (res) => {
    // console.log(res);
    rows = res;
  },
}).then(() => renderTable());

const renderTable = async () => {
  rows.forEach(async (row) => {
    var currentRow = document.createElement("tr");

    var idSequence = document.createElement("td");
    idSequence.innerText = row.idSequence;
    currentRow.appendChild(idSequence);

    var name = document.createElement("td");
    name.innerText = row.name;
    currentRow.appendChild(name);

    var createdAt = document.createElement("td");
    createdAt.innerText = new Date(row.createdTimestamp).toLocaleString();
    currentRow.appendChild(createdAt);

    var cm0 = document.createElement("td");
    cm0.innerText = row.cm0;
    currentRow.appendChild(cm0);

    var cm2 = document.createElement("td");
    cm2.innerText = row.cm2;
    currentRow.appendChild(cm2);

    var cm4 = document.createElement("td");
    cm4.innerText = row.cm4;
    currentRow.appendChild(cm4);

    var cm6 = document.createElement("td");
    cm6.innerText = row.cm6;
    currentRow.appendChild(cm6);

    var comment = document.createElement("td");
    comment.innerText = row.comment;
    currentRow.appendChild(comment);

    var btnCol = document.createElement("td");
    var btnEdit = document.createElement("button");
    $(btnEdit).attr("type", "button");
    $(btnEdit).attr("onclick", `edit(${row.idSequence})`);
    $(btnEdit).html(`<i class="fa fa-pencil" aria-hidden="true"></i>`);
    btnEdit.classList.add(
      "btn",
      "btn-dark",
      "btn-sm",
      "bg-dark",
      "text-white",
      "mx-1",
      "my-1"
    );
    btnCol.appendChild(btnEdit);

    var btnDel = document.createElement("button");
    $(btnDel).attr("type", "button");
    $(btnDel).attr("onclick", `del(${row.idSequence})`);
    $(btnDel).html(`<i class="fa fa-trash" aria-hidden="true"></i>`);
    btnDel.classList.add(
      "btn",
      "btn-dark",
      "btn-sm",
      "bg-dark",
      "text-white",
      "mx-1",
      "my-1"
    );
    btnCol.appendChild(btnDel);

    currentRow.appendChild(btnCol);

    $(tableList).append(currentRow);
  });
};
