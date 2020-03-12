import '~/styles/index.scss';
import Router from '~/scripts/router'
import GlobalState from '~/scripts/globalState'

async function initApp () {
  try {
    GlobalState.init();
    await Router.setRootContent();
    document.getElementById('nav-home-link').addEventListener('click', () => {
      Router.onNavigate('/');
    });
  } catch (e) {
    Router.onNavigate('/');
  }
}
window.onpopstate = async () => {
  try {
    await Router.setRootContent();
  } catch (e) {
    Router.onNavigate('/');
  }
};
initApp();

// // window on destroy remove imageObserver and all listeners
