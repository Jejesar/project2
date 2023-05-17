const editForm = document.getElementById("edit-form");

$(editForm).submit((e) => {
  e.preventDefault();

  // Get the form data
  // var formData = new FormData($(editForm));
  var formData = $(editForm).serialize();
  console.log(document.location.pathname);

  // Submit the form using AJAX
  $.ajax({
    type: "POST",
    url: `/api${document.location.pathname}`,
    data: formData,
    success: (res) => {
      // Handle success response
      document.location = "/history";
    },
    error: () => {
      // Handle error response
      // alert("Error submitting the form. Please try again.");
      console.log(res);
    },
  });
});
