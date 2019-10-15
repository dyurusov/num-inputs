import './scss/layout.scss';
import './scss/default.scss';
import './scss/custom.scss';
import NumericInput from './numeric-input';
import CalcInput from './calc-input';

const numInputDefault = new NumericInput('numInputDefault');
const numInputCustom = new NumericInput('numInputCustom');

const calcInputDefault = new CalcInput('calcInputDefault');
const calcInputCustom = new CalcInput('calcInputCustom');

console.log(numInputDefault);
console.log(numInputCustom);
console.log(calcInputDefault);
console.log(calcInputCustom);

const tmplt = document.getElementById('tmpl');
if (tmplt) {
  [numInputDefault, calcInputDefault].forEach(input => {
    if (input.isMounted) {
      const el = document.createElement('div');
      el.append(tmplt.content.cloneNode(true));
      input.host.after(el);
    }
  });
}
