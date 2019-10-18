import { ValueType, ParsedType } from './types';

export default class ParserUtils {

  /**
   * @returns
   *  - {number} for correctly parsed value
   *  - {null} for empty parsed value
   *  - {undefined} for incorect value
   */
  static parseNumeric(value: ValueType): ParsedType {
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
    const matches = trimmed.match(/^(\+|-)?(\d*)\.?(\d*)$/);
    if (!matches || (!matches[2] && !matches[3])) {
      return undefined;
    }

    const sign = (matches[1] === '-') ? -1 : 1;
    const integralPart = matches[2] ? parseFloat(matches[2]) : 0;
    const fractionalPart = matches[3] ? parseFloat(`0.${matches[3]}`) : 0;

    return sign * (integralPart + fractionalPart) || 0; // convert -0 to 0
  }


  /**
   * @returns
   *  - {number} for correctly parsed value
   *  - {null} for empty parsed value
   *  - {undefined} for incorect value
   */
  static parseExpression(value: ValueType): ParsedType {
    const asNumeric = ParserUtils.parseNumeric(value);
    if (asNumeric !== undefined) {
      return asNumeric;
    }

    try {
      const condenced = ParserUtils.parseExpressionSimpleChecks((value as string).trim());
      return ParserUtils.parseExpressionBrackets(condenced);
    } catch (e) {
      return undefined;
    }
  }


  /**
   * Peforms simple checks to simplify further parsing
   * @params
   *  trimmed string
   * @returns
   *  condenced (withowt spaces) string or undefined
   */
  static parseExpressionSimpleChecks(trimmed: string): string {
    // check for invalid chars
    if (trimmed.match(/[^\d .+\-/*()]/)) {
      throw new Error();
    }

    // check for spaces within numbers
    if (trimmed.match(/[\d.]\s+[\d.]/)) {
      throw new Error();
    }

    // it is safe to remove spaces now
    const condenced = trimmed.replace(/\s/g, '');

    // check for doubled actions
    if (condenced.match(/[-+/*][-+/*]/)) {
      throw new Error();
    }

    // check for emty brackets
    if (condenced.match(/\(\)/)) {
      throw new Error();
    }

    // check for invalid number of openning and closing brackets
    if ((condenced.match(/\(/g) || []).length !== (condenced.match(/\)/g) || []).length) {
      throw new Error();
    }

    return condenced;
  }


  static parseExpressionBrackets(condenced: string): ParsedType {
    /**
     * @TODO
     *  replace after implementation
     * */
    return Infinity; // undefined;

    /*
    содержит скобки?
      + да
        закрывающая скобка раньше отрывающаей?
          + да
            throw
          - нет
            ...
      - нет
        обрабатываем группировку
    */
  }
}
