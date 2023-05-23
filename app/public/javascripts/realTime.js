const table = document.getElementById("table");
const tableList = document.getElementById("table-list-measures");

var rows = [];
var newRows = [];

$.ajax({
  type: "get",
  url: "/api/get/measures",
  success: (res) => {
    rows = res;
  },
}).then(() => renderTable());

setInterval(() => {
  $.ajax({
    type: "get",
    url: "/api/get/measures",
    success: (res) => {
      newRows = res;
    },
  });
}, 1000);

const addRows = () => {
  newRows.forEach((row) => {
    var currentRow = document.createElement("tr");

    var idMeasure = document.createElement("td");
    idMeasure.innerText = row.idMeasure;
    currentRow.appendChild(idMeasure);

    var idSequence = document.createElement("td");
    idSequence.innerText = row.idSequence ? row.idSequence : "No sequence";
    currentRow.appendChild(idSequence);

    var createdAt = document.createElement("td");
    createdAt.innerText = new Date(row.createdTimestamp).toLocaleString();
    currentRow.appendChild(createdAt);

    var typeOf = document.createElement("td");
    typeOf.innerText = row.typeOf;
    currentRow.appendChild(typeOf);

    $(tableList).prepend(currentRow); // Rerversed .append

    rows.push(row);
  });
};

const renderTable = () => {
  rows.forEach((row) => {
    var currentRow = document.createElement("tr");

    var idMeasure = document.createElement("td");
    idMeasure.innerText = row.idMeasure;
    currentRow.appendChild(idMeasure);

    var idSequence = document.createElement("td");
    idSequence.innerText = row.idSequence ? row.idSequence : "No sequence";
    currentRow.appendChild(idSequence);

    var createdAt = document.createElement("td");
    createdAt.innerText = new Date(row.createdTimestamp).toLocaleString();
    currentRow.appendChild(createdAt);

    var typeOf = document.createElement("td");
    typeOf.innerText = row.typeOf;
    currentRow.appendChild(typeOf);

    $(tableList).prepend(currentRow); // Rerversed .append
  });
};
