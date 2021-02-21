const dropdown = document.querySelector('.select-alien');
const datepicker = document.querySelector('.datepicker');

dropdown.addEventListener('fwOptionClick', function updLablOfDrpdwn() {
  return dropdown.setAttribute('label', dropdown.value);
});
