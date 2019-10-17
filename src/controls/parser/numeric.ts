import { ParserInterface, ValueType, ParsedType } from './types';

export class NumericParser implements ParserInterface {
  parse(value: ValueType): ParsedType {
    // handle numbers and NaN
    if (typeof value === 'number') {
      return isNaN(value)
        ? null
        : (value || 0);  // convert -0 to 0
    }

    // handle undefined and null
    if ((value === undefined) || (value === null)) {
      return null;
    }

    // handle empty strings
    const trimmed = value.trim();
    if (!trimmed.length) {
      return null;
    }

    // check for valid format and separate parts
    const matches = trimmed.match(/^((\+|-)\s*)?(\d*)\.?(\d*)$/);
    if (!matches) {
      return undefined;
    }

    const sign = (matches[2] === '-') ? -1 : 1;
    const integralPart = matches[3] ? parseFloat(matches[3]) : 0;
    const fractionalPart = matches[4] ? parseFloat(`0.${matches[4]}`) : 0;

    return sign * (integralPart + fractionalPart) || 0; // convert -0 to 0
  }
}
