const _getRefToElement = (id) => document.getElementById(id);

export const createElement = (type, className, content) => {
  const el = document.createElement(type);
  el.className = className;
  el.innerHTML = content;
  return el;
};

export const shortenName = (name) =>  name && name.length > 50 ? `${name.substring(0, 50)}...` : name;

export const showErrorMessage = (id, text, error) => {
  const errorMessageEl = _getRefToElement(id);
  errorMessageEl.textContent = text;
  errorMessageEl.style.display = 'block';
};

export const displayStars = (starsCount)  => {
  if (starsCount === 0) return '';
  const starSvg = `<img src=${require('../../static/images/star.svg')} alt="rating star svg"/>`;
  if (starsCount === 1) return starSvg;
  const stars = [];
  for (let i = 0; i < starsCount; i++) {
    stars.push(starSvg);
  }
  return stars.join('');
};

export const bottomWindow = {
  get (document) {
    return Math.ceil(document.body.scrollTop || document.documentElement.scrollTop) + window.innerHeight + 50 >= this.docHeight(document)
  },
  docHeight (document) {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
  }
};

export const getRefToElement = _getRefToElement;
