import { NumericDomBuilder } from './numeric';
import { Options } from './types';
import { ValueType } from '../types';

const defaultInvalidSign = '?';

export class CalcDomBuilder extends NumericDomBuilder {
  protected invalidSign: string;

  constructor(options: Options = {}) {
    super(options);
    this.invalidSign = options.invalidSign || defaultInvalidSign;
  }

  protected buildElements(): Array<HTMLElement> {
    return [ this.buildInput(), this.buildDisplay() ];
  }

  protected buildDisplay(): HTMLElement {
    const display = document.createElement('span');

    // listen for input field events
    display.tabIndex = -1; // force focus related events for display
    display.addEventListener('focusin', () => this.wrapper && this.wrapper.classList.add(this.classNames.hasFocus));
    display.addEventListener('focusout', () => this.wrapper && this.wrapper.classList.remove(this.classNames.hasFocus));

    // listen for owner events and remeber unlisten methods for unmounting
    const valueListener = (value: ValueType): void => {
      display.innerHTML = (value !== null)
        ? value === undefined ? this.invalidSign : (value as string)
        : '';
    };
    this.owner && this.unsubscribers.push(this.owner.on('valueChanged', valueListener));

    // set initial values
    this.owner && valueListener(this.owner.value || null);

    return display;
  }
}
