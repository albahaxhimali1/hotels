import Router from '~/scripts/router'
import ImageLazyLoad from '~/scripts/imageLazyLoad'
import hotelsService from '~/services/hotels';
import GlobalState from '~/scripts/globalState'
import {bottomWindow, getRefToElement, shortenName, showErrorMessage, displayStars, createElement} from '~/scripts/utils'

let hotelsContainer = null;
let valuePrice = null;
// filter inputs
const defaultStars = 3;
const defaultMaxPrice = 1000;
let allHotels = GlobalState.getHotels();
let filteredHotels = [];
let paginatedHotels = [];

// infinite scroll
const offset = 15;
let start = 0;
let end = 15;

const createStarsSelectOptions = () => {
  return [1, 2, 3, 4, 5].map((star, index) => (
    `<option value="${star}" ${index + 1 === defaultStars ? 'selected' : ''}>${star}</option>`
  )).join('');
};
const innerHtml = `
  <div class="main-image-container">
    <div class="main-image-holder"></div>
    <div class="layout-container">
      <div class="layout-holder">
        <h1 class="title-wrapper">Incredible hotel deals</h1>
      </div>
    </div>
  </div>
  <div class="filters-container" id="filter-container"></div>
  <div class="all-hotels-container" id="hotels-container"></div>
  <p class="error-message" id="hotels-error-message"></p>
`;
export default innerHtml;

const reachedTotalNumberOfHotels = () => end >= filteredHotels.length;

const createHotelElement = (hotel) => {
  return createElement('a', 'hotel-holder',
    `
        <div class="hotel-holder_image-holder">
          <div class="hotel-holder_image">
            <img class="lzy_img" 
                 src="../../static/images/lazyBackground.jpg"
                 data-lazyerror="../../static/images/lazyBackground.jpg"
                 data-src=${hotel.images && hotel.images.length > 0 && hotel.images[0] || require('../../static/images/lazyBackground.jpg')} 
                 alt="${hotel.name}"
            />
           </div>
        </div>
        <p class="hotel-holder_title">${shortenName(hotel.name)}</p>
        <div class="hotel-holder_type-rating">
          <span>€${hotel.price}</span>
          <div class="hotel-stars-holder">
            ${displayStars(hotel.stars)}
          </div>
        </div>
    `
  );
};

const showHotels = () => {
  paginatedHotels = filteredHotels.filter((hotel, index) => index >= start && index < end);
  paginatedHotels.forEach(function(hotel) {
    const el = createHotelElement(hotel);
    el.addEventListener('click', async () => {
      // remove listeners and image observer before destroying page
      window.removeEventListener('scroll', getWindowScroll);
      ImageLazyLoad.stopObserver();

      await GlobalState.setSelectedHotel(hotel);
      Router.onNavigate(`/hotel`);
    });
    hotelsContainer.appendChild(el);
  });
  ImageLazyLoad.startObserver();
};

const filterHotels = (stars, price) => allHotels.filter(hotel => hotel.stars === stars && hotel.price <= price);

function getWindowScroll () {
  const bottomOfWindow = bottomWindow.get(document);
  if (bottomOfWindow && !reachedTotalNumberOfHotels()) {
    start = end;
    end += offset;
    showHotels();
  }
}

async function getHotels() {
  try {
    const res = await hotelsService.getHotels();
    allHotels = res.data || [];
    if (allHotels.length === 0) {
      showErrorMessage('hotels-error-message', 'No Hotels Found', error);
      return;
    }
    initInputListeners();
    GlobalState.setHotels(allHotels);
    filteredHotels = filterHotels(defaultStars, defaultMaxPrice);
    showHotels();
    window.addEventListener('scroll', getWindowScroll);
  } catch (error) {
    showErrorMessage('hotels-error-message', 'No Hotels Found', error);
  }
}

function starsInputListener () {
  let starsInput = getRefToElement('rating');
  let priceInput = getRefToElement('price');
  starsInput.onchange = (event) => {
    filteredHotels = filterHotels(parseInt(event.target.value, 10), parseInt(priceInput.value, 10));
    hotelsContainer.innerHTML = '';
    start = 0;
    end = 15;
    showHotels();
  };
}
function priceInputListener () {
  let starsInput = getRefToElement('rating');
  let priceInput = getRefToElement('price');
  priceInput.oninput = (event) => {
    valuePrice.innerHTML = parseInt(event.target.value, 10);
  };
  priceInput.onchange = (event) => {
    filteredHotels = filterHotels(parseInt(starsInput.value, 10), parseInt(event.target.value, 10));
    hotelsContainer.innerHTML = '';
    start = 0;
    end = 15;
    showHotels();
  };
}
const filterHolderHtml = `
<div class="filters-holder">
  <div class="filter-wrapper">
    <label for="rating">Stars</label>
    <select id="rating">
      ${createStarsSelectOptions()}
    </select>
  </div>
  <div class="filter-wrapper">
    <label for="price">Max price <span id="max-price-value"></span></label>
    <input type="range" min="1" max="1000" value="1000" class="slider" id="price">
  </div>
</div>
`;
function initInputListeners () {
  const filterContainer = getRefToElement('filter-container');
  filterContainer.innerHTML = filterHolderHtml;
  valuePrice = getRefToElement('max-price-value');
  valuePrice.innerHTML = defaultMaxPrice;
  starsInputListener();
  priceInputListener();
}

function init () {
  hotelsContainer = getRefToElement('hotels-container');
  if (allHotels.length === 0) {
    getHotels();
  } else {
    filteredHotels = filterHotels(defaultStars, defaultMaxPrice);
    showHotels();
  }
}
export const initApp = init;
