const API_LINK = "https://anapioficeandfire.com/api/books";

function getConfigs(savedConfigs) {
  if (savedConfigs) {
    $("#bgc").val(savedConfigs.bgColour);
    $("#book").val(savedConfigs.book);
  }
}

function postConfigs() {
  return {
    bgColour: $("#bgc").val(),
    book: $("#book option:selected").val(),
  };
}

function showValidationMessage(inputClass, message) {
  var validationSelector = $(`#${inputClass}-validation`);
  validationSelector.fadeIn();
  validationSelector.text(message);
  validationSelector.fadeOut(1500);
}

function validate() {
  if ($("#bgc").val() === "#000000") {
    showValidationMessage("bgc", "Background colour cannot be black!");
    return false;
  }
  return true;
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
