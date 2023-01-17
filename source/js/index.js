import '../less/style.module.less';

const burger = document.querySelector('.header-logo__button');
const index = document.querySelector('.main-nav');

burger?.addEventListener('click', () => {
  index.classList.toggle('main-nav--open');
  burger.classList.toggle('header-logo__button--close');
} )
