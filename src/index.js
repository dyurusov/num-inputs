import './scss/layout.scss';
import './scss/default.scss';
import './scss/custom.scss';
import NumericInput from './controls/numeric-input';
import CalcInput from './controls/calc-input';


// create demo controls
const numInputDefault = new NumericInput('numInputDefault');
const numInputCustom = new NumericInput('numInputCustom');
const calcInputDefault = new CalcInput('calcInputDefault');
const calcInputCustom = new CalcInput('calcInputCustom');

// build test harness
const tmplt = document.getElementById('tmpl');
if (tmplt) {
  [numInputDefault, calcInputDefault].forEach(input => {
    if (input.isMounted) {
      const wrapper = document.createElement('div');
      wrapper.append(tmplt.content.cloneNode(true));
      input.hostElement.after(wrapper);

      const valueListner = value => wrapper.querySelector('.property.value .val').innerHTML = value || '';
      const textListner = text => wrapper.querySelector('.property.text .val').innerHTML = text || '';
      const validListner = isValid => wrapper.querySelector('.property.valid .val').innerHTML = isValid ? 'true' : 'false';

      // init harness controls by demo control values
      valueListner(input.value);
      textListner(input.text);
      validListner(input.isValid);

      // subscribe for demo control changes
      input.on('valueChanged', valueListner);
      input.on('textChanged', textListner);
      input.on('isValidChanged', validListner);

      // bind harness buttons for demo control values updating
      wrapper.querySelector('.setter.value button')
        .addEventListener('click', event => input.value = event.target.parentElement.querySelector('input').value);
      wrapper.querySelector('.setter.text button')
        .addEventListener('click', event => input.text = event.target.parentElement.querySelector('input').value);
    }
  });
}

// bind destroy button action
const destroyButton = document.getElementById('destroy-button');
if (destroyButton) {
  destroyButton.addEventListener('click', () => {
    [numInputDefault, numInputCustom, calcInputDefault, calcInputCustom].forEach(input => input.destroy());
  });
}
