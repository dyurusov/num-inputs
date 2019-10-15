export default class Input {
  constructor (elOrId) {
    this._hostElement = elOrId instanceof HTMLElement
      ? elOrId
      : document.getElementById(elOrId);
    this._render();
    this._value = null;
    this._text = '';
    this._eventListeners = {};
  }

  _render () {
    if (this._hostElement) {
      this._hostElement.innerHTML = this._hostElement.id;
    }
  }

  get hostElement () {
    return this._hostElement;
  }

  get isMounted () {
    return !!this.hostElement;
  }


  get value () {
    return this._value === undefined ? '?' : this._value;
  }

  set value (value) {
    const prevValues = this._currentValues;
    this._value = this._parseValue(value);
    if (this._value === undefined) {
      this._value = null;
    }
    this._text = this._value === null ? '' : this._value;
    this._emitEvents(prevValues);
  }


  get text () {
    return this._text;
  }

  set text (text) {
    const prevValues = this._currentValues;
    if (!text) {
      this._text = '';
      this._value = null;
    } else {
      this._text = text;
      this._value = this._parseValue(text);
    }
    this._emitEvents(prevValues);
  }

  _parseValue (text) {
    const value = parseFloat(text);
    return isNaN(value) ? undefined : value;
  }

  get isValid () {
    return this._value !== undefined;
  }


  get _currentValues () {
    return {
      value: this.value,
      text: this.text,
      isvalid: this.isValid,
    };
  }


  on (eventName, eventHandler) {
    // TODO: validate args
    if (this.isMounted) {
      if (!this._eventListeners[eventName]) {
        this._eventListeners[eventName] = [];
      }
      this._eventListeners[eventName].push(eventHandler);
    }
  }

  _emit (eventName, arg) {
    if (this._eventListeners[eventName]) {
      this._eventListeners[eventName].forEach(listner => listner(arg));
    }
  }

  _emitEvents (prevValues) {
    if (prevValues.value !== this.value) {
      this._emit('valueChanged', this.value);
    }
    if (prevValues.text !== this.text) {
      this._emit('textChanged', this.text);
    }
    if (prevValues.isValid !== this.isValid) {
      this._emit('isValidChanged', this.isValid);
    }
  }


  destroy () {
    if (this.isMounted) {
      this._hostElement.innerHTML = '';
      this._hostElement = null;
      this._eventListeners = {};
    }
  }
}
