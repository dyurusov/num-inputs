import { DomBuilderInterface, Options, CssClassNames, OwnerGetter } from './types';
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
  protected getOwner: OwnerGetter;

  constructor(ownerGetter: OwnerGetter, options: Options = {}) {
    this.classNames = Object.assign(defaultClassNames, options.classNames || {});
    this.getOwner = ownerGetter;
  }

  mount(hostElement: HTMLElement): void {
    if (!this.isMounted) {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add(this.classNames.wrapper);
      this.buildElements().forEach(element => this.wrapper && this.wrapper.append(element));
      hostElement.append(this.wrapper);
      this._isMounted = true;
    }
  }

  protected buildElements(): Array<HTMLElement> {
    return [ this.buildInput() ];
  }

  protected buildInput(): HTMLElement {
    const input = document.createElement('input');
    input.type = 'text';

    // listen for input field events
    input.addEventListener('focus', () => this.wrapper && this.wrapper.classList.add(this.classNames.hasFocus));
    input.addEventListener('blur', () => this.wrapper && this.wrapper.classList.remove(this.classNames.hasFocus));
    input.addEventListener('input', () => this.owner.text = input.value);

    // listen for owner evnts (and remeber unlisten methods for unmounting)
    const isValidListener = (isValid: boolean): void =>
      this.wrapper && this.wrapper.classList[isValid ? 'remove' : 'add'](this.classNames.isInvalid);
    this.unsubscribers.push(this.owner.on('isValidChanged', isValidListener));
    const textListener = (text: string): void => { input.value = text };
    this.unsubscribers.push(this.owner.on('textChanged', textListener));

    return input;
  }

  unmount(): void {
    if (this.isMounted) {
      this.unsubscribers.forEach(unsubscriber => unsubscriber());
      this.wrapper && this.wrapper.remove();
      this.wrapper = undefined;
      this._isMounted = false;
    }
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  protected get owner(): InputInterface {
    return this.getOwner();
  }
}