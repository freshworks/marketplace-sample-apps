const dropdown = document.querySelector('.select-alien');
const datepicker = document.querySelector('.datepicker');

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  async function renderApp() {
    try {
      client = await app.initialized();
      console.log(client);
    } catch (error) {
      return console.error(error);
    }
  }
};

dropdown.addEventListener('fwOptionClick', function updLablOfDrpdwn() {
  return dropdown.setAttribute('label', dropdown.value);
});


