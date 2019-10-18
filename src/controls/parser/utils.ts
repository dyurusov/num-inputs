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
      const condenced = ParserUtils.parseExpressionCondence((value as string).trim());
      return ParserUtils.parseExpressionBrackets(condenced);
    } catch (e) {
      return undefined;
    }
  }


  /**
   * Peforms simple checks to simplify further parsing
   * @params trimmed string
   * @returns condenced (withowt spaces) string or undefined
   * @throws on unparsable condensed
   */
  static parseExpressionCondence(trimmed: string): string {
    if (trimmed.match(/[^\d .+\-/*()]/)) {
      throw new Error('Invalid char');
    }

    if (trimmed.match(/[\d.]\s+[\d.]/)) {
      throw new Error('Space within number');
    }

    // it is safe to remove spaces now
    const condenced = trimmed.replace(/\s/g, '');

    if (condenced.match(/[-+/*][-+/*]/)) {
      throw new Error('Doubled actions');
    }

    if (condenced.match(/(\(\)|\)\()/)) {
      throw new Error('Immediately adjacent unsimilar brackets');
    }

    if ((condenced.match(/\(/g) || []).length !== (condenced.match(/\)/g) || []).length) {
      throw new Error('Invalid number of openning and closing brackets');
    }

    return condenced;
  }


  /**
   * Handles brackets groups
   * @params condenced string containing (, ), *, /, -, +, . and digits onlu
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionBrackets(condenced: string): number {
    if (condenced.match(/^[*/]/)) {
      throw new Error('Multiplication or division on the first position');
    }

    if (condenced.match(/[*/+-]$/)) {
      throw new Error('Multiplication, division, adding or substraction on the first position');
    }

    let curPosition = 0;
    do {
      const opnPosition = condenced.indexOf('(', curPosition);
      const opnIsFound = (opnPosition !== -1);
      const firstClsPosition = condenced.indexOf(')', curPosition);
      const firstClsIsFound = (firstClsPosition !== -1);
      if (opnIsFound) {
        if (!firstClsIsFound) {
          throw new Error('No closing bracket');
        }
        if (opnPosition > firstClsPosition) {
          throw new Error('Closing bracket befor opening one');
        }
        const clsPosition = ParserUtils.findClosingBracket(condenced, opnPosition);
        const bracketsContent = condenced.substring(opnPosition + 1, clsPosition);
        const numericBracketsContent = ParserUtils.parseNumeric(bracketsContent);
        if (numericBracketsContent === null) {
          throw new Error('Empty numeric');
        }
        let newBracketsContent = '';
        if (numericBracketsContent === undefined) {
          const parsedBracketsContent = ParserUtils.parseExpressionBrackets(bracketsContent);
          newBracketsContent = (parsedBracketsContent < 0)
            ? `(${parsedBracketsContent})`
            : (parsedBracketsContent as unknown as string);
        } else {
          newBracketsContent = (numericBracketsContent < 0)
            ? `(${numericBracketsContent})`
            : (numericBracketsContent as unknown as string);
        }
        condenced.replace(`(${bracketsContent})`, newBracketsContent);
        curPosition = opnPosition + 1;
      } else {
        if (firstClsIsFound) {
          throw new Error('Closing bracket without opening one');
        }
        break;
      }
    } while (curPosition < condenced.length); // loop is never broken by this condition

    return ParserUtils.parseExpressionMultiplication(condenced);
  }


  /**
   * Findes closing bracket for opening one at the start position
   * @params expression to search and position of opening bracket
   * @returns corresponging closing bracket
   * @throws if not found or now opening bracket on start position
   */
  static findClosingBracket(expression: string, start: number): number {
    if (expression[start] !== '(') {
      throw new Error('No opening bracket at start position');
    }

    let level = 0;
    for (let pos = start + 1; pos < expression.length; pos++) {
      const char = expression[pos];
      if (char === ')') {
        if (!level) {
          return pos;
        }
        level--;
      } else if (char === '(') {
        level++;
      }
    }

    throw new Error('Closing bracket is not found');
  }


  /**
   * Handles multiplication groups
   * @params condenced string containing *, /, -, +, . and digits only
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionMultiplication(condenced: string): number {
    return Infinity;
  }
}
