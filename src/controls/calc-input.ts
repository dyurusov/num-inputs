import { Control } from './control';
import { CalcParser } from './parser/calc';
import { CalcDomBuilder } from './dom-builder/calc';


export default class CalcInput extends Control {
  constructor(element: HTMLElement | string) {
    super(element, new CalcParser(), new CalcDomBuilder({ classNames: { wrapper: 'calc-input-widget' } }));
  }
}
