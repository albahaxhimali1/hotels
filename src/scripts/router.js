function _loadPage (module) {
  return new Promise((resolve, reject) => {
    Router.rootDiv.innerHTML = module.default || '';
    resolve();
  });
}

async function _loadModule(module) {
  await _loadPage(module);
  module.initApp();
}

const Router = {
  rootDiv: document.getElementById('root'),
  routes: {
    '/': () => import(/* webpackChunkName: "homePage" */'~/pages/home').then(_loadModule),
    '/hotel': () => import(/* webpackChunkName: "hotelPage" */ '~/pages/hotel').then(_loadModule)
  },
  setRootContent () {
    return new Promise((resolve, reject) => {
      if (Object.keys(Router.routes).indexOf(window.location.pathname) === -1) reject();
      this.routes[window.location.pathname]();
      resolve();
    });
  },
  onNavigate (pathname) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    if (Object.keys(Router.routes).indexOf(window.location.pathname) === -1) {
      this.onNavigate('/');
    } else {
      this.routes[pathname]();
    }
  }
};
export default Router;
