import { Control } from './control';
import { NumericParser } from './parser/numeric';
import { NumericDomBuilder } from './dom-builder/numeric';


export default class NumericInput extends Control {
  constructor(element: HTMLElement | string) {
    super(element, new NumericParser(), new NumericDomBuilder({ classNames: { wrapper: 'number-input-widget' } }));
  }
}
