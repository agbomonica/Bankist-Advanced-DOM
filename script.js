'use strict';

///////////////////////////////////////
// 1. Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// 2. SMOOTH SCROLL
btnScrollTo.addEventListener('click', function (e) {
  console.log(e.target);
  console.log(e.target.getBoundingClientRect());

  // CURRENT SCROLL POSITION - window
  console.log('Current scroll (X/Y):', window.pageXOffset, window.pageYOffset);

  // HEIGHT & WIDTH OF VIEWPORT - html
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  /////////////////////////////
  // Scroll Functionality
  /////////////////////////////

  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////
// PAGE NAVIGATION
/////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////
// 3. Tabbed Component
//////////////////////

// NB:
// 1. There are 2 ways we can get to each tab button, select all buttons with a loop
// 2. delegate an eventListener to a parent element and with bubbling, you get access to each button without a loop

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

  // console.log(clicked.dataset.tab);
});

//////////////////////////
// 4. Menu fade animation
/////////////////////////

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    // select all elements with nav__link class
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    // select all image children of .nav
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Event delegation
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////
// 5. STICKY NAVIGATION
////////////////////////////

////////////////////
// STICKY NAV - IO
////////////////////

const stickyNav = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when target is not visible
  rootMargin: `${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////
// 6. REVEAL ELEMENTS ON SCROLL - IO
//////////////////////////////////////////

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
});

////////////////////////////////
// 7. LAZY LOADING IMAGES - IO
///////////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////
// 8. Carousel
//////////////////////////

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0; //  slide-0, silde-1...slide-n
  const maxSlide = slides.length;

  // functions
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    // creating dots for each slide
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // add class active to element with the current dot selected
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Initialization
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // 1. Next slide
  btnRight.addEventListener('click', nextSlide);

  // 2. previous slide
  btnLeft.addEventListener('click', prevSlide);

  // 3. Using keyboard to move to the prev & next slide
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // short circuiting
  });

  // 4. Using dots to move to prev & next   - KEY: data-slide
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // 0, 1, 2...
      goToSlide(slide); // goToSlide(0), goToSlide(1) ....
      activateDot(slide);
    }
  });
};

slider();

//////////////////////////////
// LIFECYCLE OF DOM EVENTS
////////////////////////////
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML is completely parsed and JS loaded/executed', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // required on some browsers in order to access the event obj
//   console.log(e);
//   e.returnValue = '';
// });
