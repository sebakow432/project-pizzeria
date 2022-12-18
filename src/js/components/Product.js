import {select, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product{
  constructor(id, data){
    this.id = id;
    this.data = data;
    this.renderInMenu();
    this.getElements();
    this.initAccordion();
    this.initOrderForm();
    this.initAmountWidget();
    this.processOrder();
    this.prepareCartProductParams();
    this.prepareCartProduct();
    //console.log('new Product:', this);
  }

  renderInMenu(){
    /* generate HTML based oon template */
    const generatedHTML = templates.menuProduct(this.data);
    /* create element using utils.createElementFromHTML */
    this.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu */
    menuContainer.appendChild(this.element);
  }

  getElements(){
    const thisProduct = this;
  
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click', function(event) {
      event.preventDefault();

      const activeProduct = document.querySelector(select.all.menuProductsActive);
      if(activeProduct && activeProduct != thisProduct.element){
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      } 

      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm(){
    const thisProduct = this;
  
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;
  
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData ', formData);
  
    // set price to default price
    let price = thisProduct.data.price;
  
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      //console.log('paramId ', paramId, 'param ', param);
  
      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        //console.log('optionId ', optionId, 'option ', option);

        const activeImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        //console.log('activeImage: ', activeImage);

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if(activeImage){
          if(optionSelected){
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          }else{
            activeImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }

        if(optionSelected) {
          if(!option.default) {
            price += option.price;
            
          }
        } else {
          if(option.default) {
            price -= option.price;
          }
        }
      }
    }
  
    // update calculated price in the HTML
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = price.toFixed(1);
  }

  addToCart(){
    const thisProduct = this;

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProductParams(){
    const thisProduct = this;
  
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData ', formData);
    const paramsSummary = {};

    for(let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      paramsSummary[paramId] = {
        label: param.label,
        options: {}
      };
  
      for(let optionId in param.options) {
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if(optionSelected) {
          paramsSummary[paramId].options[optionId] = optionId;
        }
      }
    }
    return paramsSummary;
  }

  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.amountWidget.value*thisProduct.priceSingle,
      params: thisProduct.prepareCartProductParams(),
    };
    return productSummary;
  }
}

export default Product;