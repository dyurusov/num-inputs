import { InputInterface } from './input-interface';
import { Control } from './control';
import { NumericParser } from './parser/numeric';
import { ValueType, EventUnsubscriber } from './types';


const widgetClassNames = {
  widget: 'number-input-widget',
  hasFocus: 'has-focus',
  isInvalid: 'is-invalid',
}

const trackedAttrs = [
  'value',
  'text',
  'isValid',
];


export default class NumericInput extends Control implements InputInterface {
  protected _hostElement?: HTMLElement;
  protected _value: ValueType = null;
  protected _text = '';
  protected _isMounted = false;
  protected _widget?: HTMLElement;
  protected unsubscribers: Array<EventUnsubscriber> = [];

  constructor(element: HTMLElement | string) {
    super(new NumericParser());
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
    return this._isMounted;
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
    this.unmount();
  }

  protected unmount(): void {
    if (this.isMounted) {
      this.clearListeners();
      this.unsubscribers.forEach(unsubscriber => unsubscriber());
      this._widget && this._widget.remove();
      this._widget = undefined;
      this._isMounted = false;
    }
  }

  protected mount(): void {
    if (this.hostElement) {
      this.clearListeners();

      const widget = document.createElement('div');
      widget.classList.add(widgetClassNames.widget);
      const input = document.createElement('input');
      input.type = 'text';
      input.addEventListener('focus', () => widget.classList.add(widgetClassNames.hasFocus));
      input.addEventListener('blur', () => widget.classList.remove(widgetClassNames.hasFocus));
      input.addEventListener('input', () => this.text = input.value);
      widget.append(input);
      this.unsubscribers.push(this.on('isValidChanged', isValid => {
        if (isValid) {
          this._widget && this._widget.classList.remove(widgetClassNames.isInvalid);
        } else {
          this._widget && this._widget.classList.add(widgetClassNames.isInvalid);
        }
      }));
      this.unsubscribers.push(this.on('textChanged', text => (input.value = text)));

      this._widget = widget;
      this._hostElement && this._hostElement.append(this._widget);
      this._isMounted = true;
    }
  }
}
