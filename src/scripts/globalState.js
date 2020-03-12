export default {
  init () {
    window.allHotels = [];
    window.selectedHotel = window.localStorage.getItem('hotel') &&
      JSON.parse(window.localStorage.getItem('hotel')) || {};
  },
  setSelectedHotel (hotel) {
    return new Promise(resolve => {
      window.selectedHotel = hotel;
      window.localStorage.setItem('hotel', JSON.stringify(hotel));
      resolve();
    });
  },
  setHotels (hotels) {
    window.allHotels = hotels;
  },
  getHotels: () => window.allHotels,
  selectedHotel: () => window.selectedHotel
};
