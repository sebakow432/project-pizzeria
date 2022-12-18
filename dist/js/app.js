import {settings, select, templates, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initMenu: function(){
    for(let productData in this.data.products){
      new Product(this.data.products[productData].id, this.data.products[productData]);
    }
  },

  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initData: function () {
    const thisApp = this;
  
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
        console.log('parsaedResponse', parsedResponse);
      });
    console.log('this.data', JSON.stringify(this.data));
  },

  init: function(){
    console.log('*** App starting ***');
    console.log('thisApp:', this);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    this.initData();
    this.initCart();
  },
};

app.init();
