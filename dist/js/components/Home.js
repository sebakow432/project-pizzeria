import { select, templates } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.render(element);
    thisHome.initCarousel();
  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homePage(element);
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
  }

  initCarousel() {
    const thisHome = this;
    thisHome.carousel = new Flickity (thisHome.dom.carousel, { // eslint-disable-line
      contain: true,
      autoPlay: true
    });

  }
}

export default Home;