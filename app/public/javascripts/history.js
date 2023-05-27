// Importations of elements from the web page
const table = document.getElementById("table");
const tableList = document.getElementById("table-list-sequences");

var rows = [];

// Get the list of all sequences
$.ajax({
  type: "get",
  url: "/api/get/all",
  success: (res) => {
    rows = res;
  },
}).then(() => renderTable());

// Render the table, sequence by sequence
const renderTable = () => {
  rows.forEach((row) => {
    // HTML row
    var currentRow = document.createElement("tr");

    // HTML column

    // ID of the sequence
    var idSequence = document.createElement("td");
    idSequence.innerText = row.idSequence;
    currentRow.appendChild(idSequence);

    // Name of the sequence
    var name = document.createElement("td");
    name.innerText = row.name;
    currentRow.appendChild(name);

    // Creation date of the sequence
    var createdAt = document.createElement("td");
    createdAt.innerText = new Date(row.createdTimestamp).toLocaleString();
    currentRow.appendChild(createdAt);

    // First measure
    var measure0 = document.createElement("td");
    measure0.innerText = row.measure0;
    currentRow.appendChild(measure0);

    // Second measure
    var measure1 = document.createElement("td");
    measure1.innerText = row.measure1;
    currentRow.appendChild(measure1);

    // Third measure
    var measure2 = document.createElement("td");
    measure2.innerText = row.measure2;
    currentRow.appendChild(measure2);

    // Fourth measure
    var measure3 = document.createElement("td");
    measure3.innerText = row.measure3;
    currentRow.appendChild(measure3);

    // Fifth measure
    var measure4 = document.createElement("td");
    measure4.innerText = row.measure4;
    currentRow.appendChild(measure4);

    // Sixth measure
    var measure5 = document.createElement("td");
    measure5.innerText = row.measure5;
    currentRow.appendChild(measure5);

    // Comment about the sequence
    var comment = document.createElement("td");
    comment.innerText = row.comment;
    currentRow.appendChild(comment);

    // Buttons edit and delete the sequence
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

    // Add created row to the table
    $(tableList).prepend(currentRow);
  });
};

// Delete one sequence from the database
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

// Redirect to the edit form
const edit = async (id) => {
  document.location = `/edit/${id}`;
};
