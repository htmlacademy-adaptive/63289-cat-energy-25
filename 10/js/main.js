const mainHeaderElement = document.querySelector('.main-header');
const mainHeaderToggle = document.querySelector('.main-header__toggle');

mainHeaderElement.classList.remove('main-header--no-js')
mainHeaderToggle.addEventListener('click', () => {
  mainHeaderElement.classList.toggle('main-header--menu-opened')})
