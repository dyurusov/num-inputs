import { InputInterface } from './input-interface';
import { NullableNumber, Events, EventListeners, EventListener } from './types';


export default class NumericInput implements InputInterface {
  protected _value: NullableNumber = null;
  protected _text: string = '';
  protected eventListeners: EventListeners = {};


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
      this.emit(Events.valueChanged, this.value);
    }
    if (prevValues.text !== this.text) {
      this.emit(Events.textChanged, this.text);
    }
    if (prevValues.isValid !== this.isValid) {
      this.emit(Events.isValidChanged, this.isValid);
    }
  }

  on(event: Events | string, listener: EventListener): void {
    // if (this.isMounted) {
    const key = <Events>event;
    if (!this.eventListeners[key]) {
      this.eventListeners[key] = [];
    }
    this.eventListeners[key]!.push(listener);
    // }
  }


  protected emit(event: Events, newValue: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event]!.forEach((listener: EventListener) => listener(newValue));
    }
  }
}
