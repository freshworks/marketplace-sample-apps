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
/**
 * Return Unique Identifier
 * Replace this function with a proper UUID generator for production apps
 */
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * Perform copy data to clipboard
 * @param {string} text - data needed to copy.
 */
function copyToClipboard(text) {
  const input = document.body.appendChild(document.createElement("input"));
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
    template: "create_voucher.html",
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
 * Save generated voucher code in Database
 * @param {string} subject - Voucher code subject
 * @param {string} description - Voucher code description
 * @param {integer} discount - Discount value in percentage
 * @param {string} validity - Voucher code time period in data scale
 * @param {string} voucher - generated voucher code
 * @returns voucher code details card DOM string
 */
function voucherDetailsCard(subject, description, discount, validity, voucher) {
  return `<div class="lookup">
  <label class="app-label text--xsmall lookup-body"><b> Voucher Subject </b></label>
  <p class="lookup-body">${subject}</p>
  <label class="app-label text--xsmall lookup-body"><b>Voucher Description </b></label>
  <p class="lookup-body">${description}</p>
  <label class="app-label text--xsmall lookup-body"><b> Discount(%) </b></label>
  <p class="lookup-body">${discount}</p>
  <label class="app-label text--xsmall lookup-body"><b>Validity</b></label>
  <p class="lookup-body">${validity}</p>
  <label class="app-label text--xsmall lookup-body"><b> Voucher Code </b></label>
  <fw-label class="lookup-body" value="${voucher}" onClick= "pasteInEditor(\'${voucher}'\)" name="pasteInEditor" data-arg1="${voucher}" color="green"></fw-label>
  <fw-icon name="magic-wand" size="12" color="green" onClick= "pasteInEditor(\'${voucher}'\)">
  </fw-icon>
  </div>`;
}

function toggleSwitchStatus() {
  document
    .getElementById("voucher-toggle")
    .addEventListener("fwChange", function () {
      let displayValue =
        document.getElementById("custom-voucher").style.display;
      if (displayValue == "block") {
        document.getElementById("custom-voucher").style.display = "none";
      } else {
        document.getElementById("custom-voucher").style.display = "block";
      }
    });
}

/**
 * Perform field validation on create_voucher.html
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
