import './scss/layout.scss';
import './scss/default.scss';
import './scss/custom.scss';
import NumericInput from './numeric-input';
import CalcInput from './calc-input';


const numInputDefault = new NumericInput('numInputDefault');
const numInputCustom = new NumericInput('numInputCustom');

const calcInputDefault = new CalcInput('calcInputDefault');
const calcInputCustom = new CalcInput('calcInputCustom');


const tmplt = document.getElementById('tmpl');
if (tmplt) {
  [
    numInputDefault,
    calcInputDefault,
  ].forEach(input => {
    if (input.isMounted) {
      const wrapper = document.createElement('div');
      wrapper.append(tmplt.content.cloneNode(true));
      input.hostElement.after(wrapper);

      const valueListner = value => {
        wrapper.querySelector('.property.value .val').innerHTML = value || '';
      };
      const textListner = text => {
        wrapper.querySelector('.property.text .val').innerHTML = text || '';
      };
      const validListner = isValid => {
        wrapper.querySelector('.property.valid .val').innerHTML = isValid ? 'true' : 'false';
      };

      valueListner(input.value);
      textListner(input.text);
      validListner(input.isValid);

      input.on('valueChanged', valueListner);
      input.on('textChanged', textListner);
      input.on('isValidChanged', validListner);

      wrapper.querySelector('.setter.value button').addEventListener('click', event => {
        input.value = event.target.parentElement.querySelector('input').value;
      });
      wrapper.querySelector('.setter.text button').addEventListener('click', event => {
        input.text = event.target.parentElement.querySelector('input').value;
      });
    }
  });
}


const destroyButton = document.getElementById('destroy-button');
if (destroyButton) {
  destroyButton.addEventListener('click', () => {
    [
      numInputDefault,
      numInputCustom,
      calcInputDefault,
      calcInputCustom,
    ].forEach(input => input.destroy());
  });
}
