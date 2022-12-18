import {settings, select} from '../settings';

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
  }

  getElements(element){
    const thisWidget = this;
  
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;
    const min = settings.amountWidget.defaultMin;
    const max = settings.amountWidget.defaultMax;
    thisWidget.value = settings.amountWidget.defaultValue;

    const newValue = parseInt(value);
    if(thisWidget.value !== newValue && !isNaN(newValue) && min <= newValue && max >= newValue) {
      thisWidget.value = newValue;
    }

    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }

  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change',function(){
      thisWidget.setValue(thisWidget.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function(){
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(){
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.element.dispatchEvent(event);

  }
}

export default AmountWidget;