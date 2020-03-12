const ImageLazyLoad = {
  imageObserver: new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.onerror = function(e) {
          lazyImage.src = lazyImage.dataset.lazyerror;
        };
        lazyImage.classList.remove('lzy_img');
        imgObserver.unobserve(lazyImage);
      }
    });
  }),
  startObserver () {
    const arr = document.querySelectorAll('img.lzy_img');
    arr.forEach((v) => {
      this.imageObserver.observe(v);
    })
  },
  stopObserver () {
    this.imageObserver.disconnect();
  }
};

export default ImageLazyLoad;
