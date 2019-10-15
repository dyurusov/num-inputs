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
