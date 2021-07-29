var clientAPP = null,
  targetContainer = "#renderOutput ul",
  li,
  label,
  arrayModules = [
    "associatedTasks",
    "recentChildTickets",
    "requesterAssets",
    "ticketAssets",
  ]; //this array is used to check if the data api returns an array of objects
const initModal = function (_client) {
  clientAPP = _client;
  initHandlers();
};

/**
 * This function takes in a data and formats it according to its data type for displaying
 * @param _v - the data to be formatted
 */
const flattenToString = function (_v) {
  var swapVariable = "";
  if (typeof _v === "string") {
    _v = _v.trim();
  } else if (Array.isArray(_v)) {
    _v = _v.join(",");
  } else if (typeof _v === "object") {
    swapVariable += "<div class='nested'>" + JSON.stringify(_v) + "</div>";
    _v = swapVariable;
  }
  if (_v === null || _v === "") {
    _v = "-";
  }
  return _v;
};

/**
 * This method gets the corresponding name of the data to be retrieved whenever the navigation button from the dropdown is clicked
 * It retrieves the data using Data API, formats it using another function and then displays it
 * @param {string} module - name of the object to be retrieved
 */
const getData = function () {
  let module = document.getElementById("codeDemo").value;
  targetContainer = document.querySelector("#renderOutput ul");
  let _data = "";
  while (targetContainer.firstChild)
    targetContainer.removeChild(targetContainer.firstChild);
  clientAPP.data
    .get(module)
    .then(function (data) {
      _data = data[module];

      toggleNavigation(module);
      if (arrayModules.indexOf(module) > -1 && _data.length) _data = _data[0];
      if (_data) {
        for (let key in _data) {
          label = document.createElement("label");
          label.innerHTML = key;
          label.className = "info";
          let value = document.createElement("label");
          value.innerHTML = flattenToString(_data[key]);
          value.className = "value";
          li = document.createElement("LI");
          li.className = "clearfix";
          li.appendChild(label);
          li.appendChild(value);
          targetContainer.appendChild(li);
        }
      }
    })
    .catch(function (e) {
      console.error("Error while fetching data from client", e);
    });
};

/**
 * This function handles the dropdown and pagination and populates the table (output) with coreesponding data.
 */

function toggleNavigation(module) {
  if (
    document
      .getElementById("codeDemo")
      .querySelector("option[value='" + module + "']") ===
    document.getElementById("codeDemo").lastElementChild
  ) {
    let nextNav = document.querySelectorAll(".navigation-menu")[0];
    nextNav.firstElementChild.nextElementSibling.firstElementChild.className =
      "disabled";
  } else {
    let nextNav = document.querySelectorAll(".navigation-menu")[0];
    nextNav.firstElementChild.nextElementSibling.firstElementChild.classList.remove(
      "disabled"
    );
  }
  if (
    document
      .getElementById("codeDemo")
      .querySelector("option[value='" + module + "']") ===
    document.getElementById("codeDemo").firstElementChild
  ) {
    let prevNav = document.querySelectorAll(".navigation-menu")[0];
    prevNav.firstElementChild.firstElementChild.className = "disabled";
  } else {
    let prevNav = document.querySelectorAll(".navigation-menu")[0];
    prevNav.firstElementChild.firstElementChild.classList.remove("disabled");
  }
}

const initHandlers = function () {
  document.getElementById("codeDemo").addEventListener("change", getData);
  document.getElementById("codeDemo").dispatchEvent(new Event("change"));
  let navigationLinks = document.querySelectorAll(".navigation-menu  li > a");
  navigationLinks.forEach((tab) => {
    tab.addEventListener("click", function () {
      handleNavigation(this);
    });
  });
};

function handleNavigation(eventData) {
  var targetDirection, currentValue, nextValue;
  currentValue = document.getElementById("codeDemo").value;
  targetDirection = eventData.getAttribute("data-target");
  nextValue = getNextValue(currentValue, targetDirection);
  document.getElementById("codeDemo").value = nextValue;
  document.getElementById("codeDemo").dispatchEvent(new Event("change"));
  if (
    document
      .getElementById("codeDemo")
      .querySelector("option[value='" + nextValue + "']") ===
      document.getElementById("codeDemo").lastElementChild ||
    document
      .getElementById("codeDemo")
      .querySelector("option[value='" + nextValue + "']") ===
      document.getElementById("codeDemo").firstElementChild
  ) {
    eventData.className = "disabled";
  }
}

function getNextValue(currentValue, targetDirection) {
  if (targetDirection === "next") {
    return document
      .getElementById("codeDemo")
      .querySelector("option[value='" + currentValue + "']").nextElementSibling
      .value;
  } else {
    return document
      .getElementById("codeDemo")
      .querySelector("option[value='" + currentValue + "']")
      .previousElementSibling.value;
  }
}

(function () {
  app.initialized().then(initModal);
})();
