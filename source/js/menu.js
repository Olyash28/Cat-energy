const burger = document.querySelector('.header-logo__button');
const menu = document.querySelector('.main-nav');

burger.addEventListener('click', () => {
  menu.classList.toggle('main-nav--open');
  burger.classList.toggle('header-logo__button--close');
  console.log(123)
} )
