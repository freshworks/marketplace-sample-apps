const API_LINK = "https://anapioficeandfire.com/api/books";

function showValidationMessage(inputClass, message) {
  var validationSelector = $(`#${inputClass}-validation`);
  validationSelector.fadeIn();
  validationSelector.text(message);
  validationSelector.fadeOut(1500);
}

function getBookFromAPI(callback) {
  $.ajax({
    url: API_LINK,
    datatype: "jsonp",
    success: function (books) {
      books.forEach(function (book) {
        $("#book").append(`<option>${book.name}</option>`);
      });
    },
  });
}

$(document).ready(function () {
  getBookFromAPI(function () {
    app.initialized();
  });
});
