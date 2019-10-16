import { InputInterface } from './input-interface';
import { NullableNumber, EventTypes, EventType, EventListeners, EventListener } from './types';


export default class NumericInput implements InputInterface {
  protected _hostElement?: HTMLElement;
  protected _value: NullableNumber = null;
  protected _text = '';
  protected eventListeners: EventListeners = new Map();
  protected _isMounted = false;
  protected _widget?: HTMLElement;


  constructor(element: HTMLElement | string) {
    const hostElement = element instanceof HTMLElement 
      ? element
      : document.getElementById(element);
    if (hostElement) {
      this._hostElement = hostElement;
      this._widget = document.createElement('div');
      this._widget.classList.add('numeric-input');
      this._hostElement.append(this._widget);
      this._isMounted = true;
    }
  }


  get hostElement(): HTMLElement | undefined {
    return this._hostElement;
  }

  get isMounted(): boolean {
    return this._isMounted;
  }


  get value(): NullableNumber {
    return this._value;
  }

  set value(value: NullableNumber) {
    this.trackChanges(() => {
      if ((value === undefined) || (value === null)) {
        this._value = null;
        this._text = '';
      } else {
        this._value = value;
        this._text = this._value.toString();
      }
    });
  }


  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this._value = this.parseText(text);
    if ((this._value === null) || (this._value === undefined)) {
      this._text = '';
    } else {
      this._text = this._value.toString();
    }
  }


  get isValid(): boolean {
    return this._value !== undefined;
  }


  protected parseText(text: string): NullableNumber {
    if (text === '') {
      return null;
    }
    const parsedValue: number = parseFloat(text);
    return isNaN(parsedValue) ? undefined : parsedValue;
  }


  protected trackChanges(setter: () => void): void {
    const prevValues = {
      value: this.value,
      text: this.text,
      isValid: this.isValid,
    };
    setter();
    if (prevValues.value !== this.value) {
      this.emit(EventTypes.valueChanged, this.value);
    }
    if (prevValues.text !== this.text) {
      this.emit(EventTypes.textChanged, this.text);
    }
    if (prevValues.isValid !== this.isValid) {
      this.emit(EventTypes.isValidChanged, this.isValid);
    }
  }

  on(event: EventType, listener: EventListener): void {
    // if (this.isMounted) {
    const key = event;
    const listeners = this.eventListeners.get(key) || [];
    listeners.push(listener);
    this.eventListeners.set(key, listeners);
    // }
  }


  protected emit(event: EventType, newValue: any): void {
    (this.eventListeners.get(event) || []).forEach((listener: EventListener) => listener(newValue));
  }


  destroy(): void {
    if (this.isMounted) {
      this.eventListeners.clear();
      this._widget && this._widget.remove();
      this._widget = undefined;
      this._isMounted = false;
    }
  }
}
