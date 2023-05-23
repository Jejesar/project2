const editForm = document.getElementById("edit-form");

$(editForm).submit((e) => {
  e.preventDefault();

  // Get the form data
  var formData = $(editForm).serialize();

  // Submit the form using the API
  $.ajax({
    type: "POST",
    url: `/api${document.location.pathname}`,
    data: formData,
    success: (res) => {
      // Redirect to the history page
      document.location = "/history";
    },
  });
});
