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
