const DANGER_NOTIFICATION = "danger";
const SUCCESS_NOTIFICATION = "success";

document.onreadystatechange = function () {
  addListeners();

  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};
/* Element event listeners */
function addListeners() {
  document
    .getElementById("create-voucher")
    .addEventListener("click", function () {
      openCreateVoucherModal("Create Voucher", {
        newVoucher: true,
      });
    });

  document
    .getElementById("list-vouchers")
    .addEventListener("click", function () {
      dispVouchers();
    });

  document
    .getElementById("remove_history")
    .addEventListener("click", function () {
      deleteVouchers();
    });
}

/* Display latest 5 voucher codes */
function dispVouchers() {
  document.getElementById("values").classList.remove("hidden");
  client.db.get("vouchers").then(function (dbData) {
    let keysArr = Object.keys(dbData).reverse();
    keysArr = keysArr.slice(0, 5);
    let vou = [];
    keysArr.forEach((element) => {
      vou.push(
        voucherDetailsCard(
          dbData[element].subject,
          dbData[element].description,
          dbData[element].discount,
          dbData[element].validity,
          dbData[element].voucher
        )
      );
    });
    document.querySelector("#values").innerHTML = vou.join(" ");

    if (keysArr.length > 0) {
      document.getElementById("remove_history").classList.remove("hidden");
    }
  }),
    function (error) {
      console.error("Error retrieving vouchers data from Database", error);
    };
}

/* Remove saved voucher codes data from database */
function deleteVouchers() {
  client.interface
    .trigger("showConfirm", {
      title: "Deleting Voucher Data",
      message: "Are you sure?",
      saveLabel: "Yes",
      cancelLabel: "No",
    })
    .then(function (result) {
      if (result.message === "Yes") {
        client.db.delete("vouchers").then(function () {
          showNotify(
            "success",
            "Success",
            "Vouchers history removed successfully"
          );
        }),
          function (error) {
            console.log("Failed to delete vouchers", error);
          };
        document.getElementById("remove_history").classList.add("hidden");
        document.getElementById("values").innerHTML = "";
      }
    }),
    function (error) {
      console.log("Failed to get response from Delete voucher alert", error);
    };
}

function onAppActivate() {
  var textElement = document.getElementById("apptext");
  var getContact = client.data.get("contact");
  getContact.then(showContact).catch(handleErr);

  function showContact(payload) {
    textElement.innerHTML = `Ticket created by ${payload.contact.name}`;
  }
}

function handleErr(err) {
  console.error(`Error occurred. Details:`, err);
}

window.frsh_init().then(function (client) {
  window.client = client;

  // current instance details
  client.instance.context().then(function (context) {
    // receive message from other instances
    client.instance.receive(function (e) {
      let data = e.helper.getData();
      console.log(
        `${context.instance_id}: Received messuage from ${JSON.stringify(
          data.sender
        )}: Message: `,
        data.message
      );

      pasteInEditor(data.message.code);
    });

    console.log("instance API context", context);
  }),
    function (error) {
      console.error(error);
    };
}),
  function (error) {
    console.error(error);
  };
