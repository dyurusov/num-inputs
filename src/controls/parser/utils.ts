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
      return ParserUtils.parseExpressionHandleBrackets(condenced);
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

    if (condenced.match(/[\d.]\(/)) {
      throw new Error('No action before non-first opening bracket');
    }

    if (condenced.match(/\)[\d.]/)) {
      throw new Error('No action after non-last closing bracket');
    }

    return condenced;
  }


  /**
   * Parse brackets groups
   * @params condenced string containing (, ), *, /, -, +, . and digits onlu
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionHandleBrackets(condenced: string): number {
    if (condenced.match(/^[*/]/)) {
      throw new Error('Multiplication or division on the first position');
    }

    if (condenced.match(/[*/+-]$/)) {
      throw new Error('Multiplication, division, adding or substraction on the first position');
    }

    // find first level brackets groups and replace them by its value
    let transformedCondenced = condenced;
    let curPosition = 0;
    do {
      // position of the first opening bracket
      const opnPosition = transformedCondenced.indexOf('(', curPosition);
      const opnIsFound = (opnPosition !== -1);

      // position of the first closinging bracket
      const firstClsPosition = transformedCondenced.indexOf(')', curPosition);
      const firstClsIsFound = (firstClsPosition !== -1);

      if (opnIsFound) {
        if (!firstClsIsFound) {
          throw new Error('No closing bracket');
        }
        if (opnPosition > firstClsPosition) {
          throw new Error('Closing bracket befor opening one');
        }

        // find coresponding losing bracket and get its value
        const clsPosition = ParserUtils.findClosingBracket(transformedCondenced, opnPosition);
        const bracketsContent = transformedCondenced.substring(opnPosition + 1, clsPosition);
        const numericBracketsContent = ParserUtils.parseNumeric(bracketsContent);
        if (numericBracketsContent === null) {
          throw new Error('Empty numeric');
        }
        const calculatedBracketsValue = (numericBracketsContent === undefined)
          ? ParserUtils.parseExpressionHandleBrackets(bracketsContent)
          : numericBracketsContent;
        const bracketsValueString = ((calculatedBracketsValue < 0)
          ? `(${calculatedBracketsValue})`
          : calculatedBracketsValue).toString();

        // replace found brackets group by its value
        transformedCondenced = transformedCondenced.substring(0, opnPosition)
        + bracketsValueString + transformedCondenced.substr(clsPosition + 1);

        // prepare nest iteration
        curPosition = opnPosition + bracketsValueString.length + 1;
      } else {
        if (firstClsIsFound) {
          throw new Error('Closing bracket without opening one');
        }
        break;
      }
    } while (true); // eslint-disable-line no-constant-condition

    return ParserUtils.parseExpressionHandleMultiplicationGroups(transformedCondenced);
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
   * Handle multiplication groups
   * @params condenced string containing *, /, -, +, . and digits only
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionHandleMultiplicationGroups(condenced: string): number {
    let transformedCondenced = condenced

    // handle leading sign if it exists
    const firstCar = transformedCondenced[0];
    const initialSign = ((firstCar === '+') || (firstCar === '-'))
      ? ((firstCar === '+') ? 1 : -1)
      : 0;

    let startPosition = initialSign ? 1 : 0;
    let endPosition = startPosition;

    // scan for multiplication/division groups and replace them by its value
    do {
      const char = transformedCondenced[endPosition];

      // skip possiable breakets with negative value
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(transformedCondenced, endPosition);
      }

      // check fot next + or -
      if ((endPosition + 1) < transformedCondenced.length) {
        const nextChar = transformedCondenced[endPosition + 1];
        if ((nextChar !== '+') && (nextChar !== '-')) {
          endPosition++;
          continue;
        }
      }

      // replace found group by its value
      const numeric = transformedCondenced.substring(startPosition, endPosition + 1);
      const parsed = ParserUtils.parseExpressionMultiply(numeric);
      const parsedSubstitution = (parsed < 0)
        ? `(${parsed})`
        : parsed.toString();
      transformedCondenced = transformedCondenced.substring(0, startPosition)
        + parsedSubstitution + transformedCondenced.substr(endPosition + 1);

      // prepare nest iteration
      startPosition = startPosition + (parsedSubstitution as string).length + 1;
      endPosition = startPosition;
    } while (startPosition < transformedCondenced.length);

    return ParserUtils.parseExpressionAdding(transformedCondenced);
  }


  /**
   * Perform multiplicatipn and division
   * @params condenced string containing *, / and digits (negative in brackets) only
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionMultiply(condenced: string): number {
    let result = 0;
    let action = 0; // 0 if not parsed so far, less then 0 for devision and greater then 0 for multiplication
    let startPosition = 0;
    let endPosition = startPosition;
    const length = condenced.length;

    // scan for * or / and perform appropriate actions
    do {
      const char = condenced[endPosition];

      // skip possiable breakets with negative value
      let withBrackets = false;
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(condenced, endPosition);
        withBrackets = true;
      }

      // check fot next * or /
      let nextChar;
      if ((endPosition + 1) < length) {
        nextChar = condenced[endPosition + 1];
        if ((nextChar !== '*') && (nextChar !== '/')) {
          endPosition++;
          continue;
        }
      }

      // separate token and parse it
      const token = condenced.substring(
        withBrackets ? (startPosition + 1) : startPosition,
        withBrackets ? endPosition : (endPosition + 1),
      );
      const parsedToken = ParserUtils.parseNumeric(token);
      if ((parsedToken === null) && (parsedToken === undefined)) {
        throw new Error(`Invalid numeric: "${token}"`);
      }

      // perform action
      if (action) {
        result = (action < 0)
          ? (result / (parsedToken as number))
          : (result * (parsedToken as number));
      } else {
        result = (parsedToken as number);
      }

      // prepare nest iteration
      if (nextChar) {
        action = (nextChar === '*') ? 1 : -1;
      }
      startPosition = endPosition + 2;
      endPosition = startPosition;
    } while (endPosition < length);

    return result;
  }


  /**
   * Perform adding and subtraction
   * @params condenced string containing +, - and digits (negative in brackets) only with possiable sign at the beginning
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionAdding(condenced: string): number {
    let result = 0;
    let action = 0; // 0 if not parsed so far, less then 0 for devision and greater then 0 for multiplication

    // handle leading sign if it exists
    const firstCar = condenced[0];
    const initialSign = ((firstCar === '+') || (firstCar === '-'))
      ? ((firstCar === '+') ? 1 : -1)
      : 0;

    let startPosition = initialSign ? 1 : 0;
    let endPosition = startPosition;
    const length = condenced.length;

    // scan for + or - and perform appropriate actions
    do {
      const char = condenced[endPosition];

      // skip possiable breakets with negative value
      let withBrackets = false;
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(condenced, endPosition);
        withBrackets = true;
      }

      // check fot next * or /
      let nextChar;
      if ((endPosition + 1) < length) {
        nextChar = condenced[endPosition + 1];
        if ((nextChar !== '+') && (nextChar !== '-')) {
          endPosition++;
          continue;
        }
      }

      // separate token and parse it
      const token = condenced.substring(
        withBrackets ? (startPosition + 1) : startPosition,
        withBrackets ? endPosition : (endPosition + 1),
      );
      const parsedToken = ParserUtils.parseNumeric(token);
      if ((parsedToken === null) && (parsedToken === undefined)) {
        throw new Error(`Invalid numeric: "${token}"`);
      }
      if (action) {
        result = (action < 0)
          ? (result - (parsedToken as number))
          : (result + (parsedToken as number))
      } else {
        result = (parsedToken as number);
        if (initialSign) {
          result *= initialSign;
        }
      }

      // prepare nest iteration
      if (nextChar) {
        action = (nextChar === '+') ? 1 : -1;
      }
      startPosition = endPosition + 2;
      endPosition = startPosition;
    } while (endPosition < length);

    return result;
  }
}
