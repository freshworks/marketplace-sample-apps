/* Display notifications via Interface API */
function showNotify(type, title, message) {
  client.interface.trigger("showNotify", {
    type: type,
    title: title,
    message: message,
  }),
    function (error) {
      console.error("Error from showNotify:", title, error);
    };
}
/* Return Unique Identifier */
function generateUuid() {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * Perform copy data to clipboard
 * @param {string} text - data needed to copy.
 */
function copyToClipboard(text) {
  var input = document.body.appendChild(document.createElement("input"));
  input.value = text;
  input.focus();
  input.select();
  document.execCommand("copy");
  input.parentNode.removeChild(input);
}

/**
 * Show modal to create voucher code
 * @param {string} title - title of the modal
 * @param {object} modalData - new voucher boolean
 */
function openCreateVoucherModal(title, modalData) {
  client.interface.trigger("showModal", {
    title: title,
    template: "create_vocher.html",
    data: modalData || {},
  });
}

/**
 * Perform paste operation with input data
 * @param {string} value - data needed to paste
 */
function pasteInEditor(value) {
  client.interface
    .trigger("setValue", { id: "editor", text: value })
    .then(function () {
      showNotify(SUCCESS_NOTIFICATION, "Success:", "Pasted in Editor");
    }),
    function (error) {
      console.error(error);
    };
}
/**
 * Perform filed validation on create_vocher.html
 * @returns Boolean: Field validation status 
 */
function validateFields() {
  document.querySelectorAll(".validation-message").innerHTML = "";
  var voucherData = getFieldValues();
  var isValid = true;

  for (var field of FIELDS_TO_VALIDATE) {
    if (!voucherData[field]) {
      document.getElementById(`${field}-error`).innerHTML =
        "Please fill this required field";
      isValid = false;
    } else {
      document.getElementById(`${field}-error`).innerText = "";
    }
  }
  return isValid;
}
