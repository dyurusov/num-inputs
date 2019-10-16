import { InputInterface } from './input-interface';
import { ValueType, EventTypes, EventType, EventListeners, EventListener } from './types';


const widgetClassNames = {
  widget: 'number-input-widget',
  hasFocus: 'has-focus',
  isInvalid: 'is-invalid',
}


export default class NumericInput implements InputInterface {
  protected _hostElement?: HTMLElement;
  protected _value: ValueType = null;
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
      const parsedValue = this.parseText(value);
      if ((parsedValue === undefined) || (parsedValue === null)) {
        this._value = null;
        this._text = '';
      } else {
        this._value = parsedValue;
        this._text = this._value.toString();
      }
    });
  }


  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this.trackChanges(() => {
      this._text = text;
      const parsedValue = this.parseText(text);
      this._value =
        ((parsedValue === null) || (parsedValue === undefined) || (parsedValue.toString() === text)) 
          ? parsedValue
          : undefined;
    });
  }


  get isValid(): boolean {
    return this._value !== undefined;
  }


  protected parseText(text: ValueType): number | undefined | null {
    if ((text === '') || (text === null) || (text === undefined)) {
      return null;
    }
    const parsedValue: number = parseFloat(text as string);
    return isNaN(parsedValue) ? undefined : parsedValue;

    // TODO:
    // regexp for all cases may be too complicated and may lead to very long parsing
    // const stringValue = (text as string).trim();
    // // should be no spaces
    // // should be not more then one plus or minus and it should be the first
    // // remember sign
    // // should be not more then one decimal point
    // // split by decimal point
    // // if less then one and more then to parts then invalid
    // // if the first part exists then parseFloat and remember
    // // if the second part exists then add decimal dot at the begonning, parseFloat and remember
    // // add the remebered parts
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
    const key = event;
    const listeners = this.eventListeners.get(key) || [];
    listeners.push(listener);
    this.eventListeners.set(key, listeners);
  }

  off(event: EventType, listener: EventListener): void {
    const listeners = (this.eventListeners.get(event) || []).filter(item => item != listener);
    this.eventListeners.set(event, listeners);
  }

  protected emit(event: EventType, newValue: any): void {
    (this.eventListeners.get(event) || []).forEach((listener: EventListener) => listener(newValue));
  }


  destroy(): void {
    this.unmount();
  }

  protected unmount(): void {
    if (this.isMounted) {
      this.eventListeners.clear();
      this.off(EventTypes.isValidChanged, this.updateWidget);
      this._widget && this._widget.remove();
      this._widget = undefined;
      this._isMounted = false;
    }
  }

  protected mount(): void {
    if (this.hostElement) {
      this.eventListeners.clear();
      const widget = document.createElement('div');
      widget.classList.add(widgetClassNames.widget);
      const input = document.createElement('input');
      input.type = 'text';
      input.addEventListener('focus', () => widget.classList.add(widgetClassNames.hasFocus));
      input.addEventListener('blur', () => widget.classList.remove(widgetClassNames.hasFocus));
      input.addEventListener('input', () => this.text = input.value);
      widget.append(input);
      this.on(EventTypes.isValidChanged, this.updateWidget);
      this.on(EventTypes.textChanged, value => (input.value = value));

      this._widget = widget;
      this._hostElement && this._hostElement.append(this._widget);
      this._isMounted = true;
    }
  }

  updateWidget = (isValid: boolean): void => {
    if (isValid) {
      this._widget && this._widget.classList.remove(widgetClassNames.isInvalid);
    } else {
      this._widget && this._widget.classList.add(widgetClassNames.isInvalid);
    }
  }
}
