const range = document.querySelector('.slider__range ');
const catWidth = document.querySelector('.example__photo-box--before');

range.addEventListener('input', () => {
  catWidth.style.width = range.value + '%';
})
