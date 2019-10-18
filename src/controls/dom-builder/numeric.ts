import { DomBuilderInterface, Options, CssClassNames } from './types';
import { EventUnsubscriber, InputInterface } from '../types';

const defaultClassNames: CssClassNames = {
  wrapper: 'control-widget',
  hasFocus: 'has-focus',
  isInvalid: 'is-invalid',
};


export class NumericDomBuilder implements DomBuilderInterface {
  protected _isMounted = false;
  protected wrapper?: HTMLElement;
  protected unsubscribers: Array<EventUnsubscriber> = [];
  protected classNames: CssClassNames;
  protected owner?: InputInterface;

  
  constructor(options: Options = {}) {
    this.classNames = Object.assign(defaultClassNames, options.classNames || {});
  }

  bindOwner(owner: InputInterface): void {
    this.owner = owner;
  }


  get isMounted(): boolean {
    return this._isMounted;
  }

  mount(hostElement: HTMLElement): void {
    if (!this.owner) {
      throw new Error('Owner is not bound');
    }
    if (!this.isMounted) {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add(this.classNames.wrapper);

      // listen for input field events
      this.wrapper.tabIndex = -1; // forse focus related events for wrapper
      this.wrapper.addEventListener('focusin', () => this.wrapper && this.wrapper.classList.add(this.classNames.hasFocus));
      this.wrapper.addEventListener('focusout', () => this.wrapper && this.wrapper.classList.remove(this.classNames.hasFocus));

      this.buildElements().forEach(element => this.wrapper && this.wrapper.append(element));
      hostElement.append(this.wrapper);
      this._isMounted = true;
    }
  }

  unmount(): void {
    if (this.isMounted) {
      this.unsubscribers.forEach(unsubscriber => unsubscriber());
      this.wrapper && this.wrapper.remove();
      this.wrapper = undefined;
      this._isMounted = false;
    }
  }

  protected buildElements(): Array<HTMLElement> {
    return [ this.buildInput() ];
  }


  protected buildInput(): HTMLElement {
    const input = document.createElement('input');
    input.type = 'text';

    // listen for input field events
    input.addEventListener('input', () => this.owner && (this.owner.text = input.value));

    // listen for owner events and remeber unlisten methods for unmounting
    const isValidListener = (isValid: boolean): void =>
      this.wrapper && this.wrapper.classList[isValid ? 'remove' : 'add'](this.classNames.isInvalid);
    this.owner && this.unsubscribers.push(this.owner.on('isValidChanged', isValidListener));
    const textListener = (text: string): void => { input.value = text };
    this.owner && this.unsubscribers.push(this.owner.on('textChanged', textListener));

    // set initial values
    this.owner && isValidListener(this.owner.isValid);
    this.owner && textListener(this.owner.text);

    return input;
  }
}
