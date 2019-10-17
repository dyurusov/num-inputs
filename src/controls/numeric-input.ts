import { Control } from './control';
import { NumericParser } from './parser/numeric';
import { NumericDomBuilder } from './dom-builder/numeric';
import { ValueType, InputInterface } from './types';


const trackedAttrs = [
  'value',
  'text',
  'isValid',
];


export default class NumericInput extends Control implements InputInterface {
  protected _hostElement?: HTMLElement;
  protected _value: ValueType = null;
  protected _text = '';

  constructor(element: HTMLElement | string) {
    super(new NumericParser(), new NumericDomBuilder(() => this, { classNames: { wrapper: 'number-input-widget' } }));
    const hostElement = element instanceof HTMLElement
      ? element
      : document.getElementById(element);
    if (hostElement) {
      this._hostElement = hostElement;
      this.mount();
    }
  }


  get hostElement(): HTMLElement | undefined {
    return this._hostElement;
  }

  get isMounted(): boolean {
    return this.domBuilder.isMounted;
  }


  get value(): ValueType {
    return this._value;
  }

  set value(value: ValueType) {
    this.trackChanges(() => {
      const parsedValue = this.parser.parse(value);
      if ((parsedValue === undefined) || (parsedValue === null)) {
        this._value = null;
        this._text = '';
      } else {
        this._value = parsedValue;
        this._text = this._value.toString();
      }
    }, trackedAttrs);
  }


  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this.trackChanges(() => {
      this._text = text;
      const parsedValue = this.parser.parse(text);
      this._value =
        ((parsedValue === null) || (parsedValue === undefined) || (parsedValue.toString() === text)) 
          ? parsedValue
          : undefined;
    }, trackedAttrs);
  }


  get isValid(): boolean {
    return this._value !== undefined;
  }


  destroy(): void {
    if (this.domBuilder.isMounted) {
      this.clearListeners();
      this.domBuilder.unmount();
    }
  }

  mount(): void {
    if (this.hostElement && !this.domBuilder.isMounted) {
      this.clearListeners();
      this.domBuilder.mount(this.hostElement);
    }
  }
}
