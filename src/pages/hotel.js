import GlobalState from '~/scripts/globalState'
import {getRefToElement, displayStars} from '~/scripts/utils'
import ImageLazyLoad from '~/scripts/imageLazyLoad'

let hotel = GlobalState.selectedHotel();
let slideIndex = 1;

const reviewContainer = `
  <span>Reviews</span>
  <div class="user-review-container">
    <div class="image-holder"></div>
    <div class="user-review-holder">
      <div class="user-review-wrapper">
        <h4>User name</h4>
        <img src="../../static/images/lazyBackground.jpg" alt="user avatar">
      </div>
      <h5 class="user-comment-holder">Great coffee</h5>
    </div>
  </div>
`;
const _displayReviews = () => hotel.reviews && hotel.reviews.length > 0 ? reviewContainer : '';

function plusSlides(n) {
  showSlides(slideIndex += n);
}
function startSlideInputListeners () {
  const prev = getRefToElement('prev-image');
  const next = getRefToElement('next-image');
  prev.addEventListener('click', function () {
    plusSlides(-1);
  });
  next.addEventListener('click', function () {
    plusSlides(1)
  });
}
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName('mySlides');
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slides[slideIndex-1].style.display = 'block';
}

function renderImages () {
  return hotel.images && hotel.images.length > 0 && hotel.images.map(image => {
    return `<div class="mySlides fade">
              <img 
                src=${require('../../static/images/lazyBackground.jpg')}
                data-lazyerror=${require('../../static/images/lazyBackground.jpg')}
                data-src="${image}"
                alt="slider image" 
                class="lzy_img"
              >
            </div>
            `
  }).join('') || '';
}

function initSlideShow () {
  return new Promise(resolve => {
    let images = renderImages();
    if (hotel.images && hotel.images.length > 1) {
      images += `
       <a class="prev" id="prev-image">&#10094;</a>
       <a class="next" id="next-image">&#10095;</a>
      `;
    }
    const slideShowContainer = getRefToElement('slideshow-container');
    slideShowContainer.innerHTML = images;
    resolve();
  });
}

async function _showHotel () {
  const container = getRefToElement('hotel-page');
  container.innerHTML = `
  <div class="hotel-info-container">
    <div class="hotel-info-holder">
      <h3>${hotel.name}</h3>
      <div class="hotel-info hotel-info-stars">
        ${displayStars(hotel.stars)}
      </div>
      <div class="hotel-info">
        <img src=${require('../../static/images/pin.svg')} alt="location svg">
        <span>${hotel.city}, ${hotel.country}</span>
      </div>
      <div class="hotel-info hotel-info-price">
        <img src=${require('../../static/images/money-bill.svg')} alt="money bill svg">
        <span>€${hotel.price}</span>
      </div>
      <h4>About</h4>
      <p>${hotel.description}</p>
    </div>
    <div class="hotel-images-holder">
      <div class="slideshow-container" id="slideshow-container"></div>
    </div>
  </div>
  <div class="review-data-information-holder">
    ${_displayReviews()}
  </div>
  `;
  await initSlideShow();
  ImageLazyLoad.startObserver();
  showSlides(slideIndex);
  if (hotel.images && hotel.images.length > 1) {
    startSlideInputListeners();
  }
}
// function init () {
//   return new Promise(resolve => {
//     hotel = GlobalState.selectedHotel();
//     resolve();
//   })
// }
function init () {
  hotel = GlobalState.selectedHotel();
  _showHotel();
}
export const initApp = init;

const HotelInnerHtml = `
  <div class="hotel-info-page" id="hotel-page"></div>
`;
export default HotelInnerHtml;
