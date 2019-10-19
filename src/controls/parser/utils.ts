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

    // find brackets groups and replace by its value
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
        const calculatedBracketsContent = (numericBracketsContent === undefined)
          ? ParserUtils.parseExpressionHandleBrackets(bracketsContent)
          : numericBracketsContent;
        const bracketsValue = ((calculatedBracketsContent < 0)
          ? `(${calculatedBracketsContent})`
          : calculatedBracketsContent).toString();

        // replace found brackets group by its value
        transformedCondenced = transformedCondenced.substring(0, opnPosition)
        + bracketsValue + transformedCondenced.substr(clsPosition + 1);

        curPosition = opnPosition + bracketsValue.length + 1;
      } else {
        if (firstClsIsFound) {
          throw new Error('Closing bracket without opening one');
        }
        break;
      }
    } while (curPosition < transformedCondenced.length); // loop is never broken by this condition

    return ParserUtils.parseExpressionMultiplicationGroups(transformedCondenced);
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
  static parseExpressionMultiplicationGroups(condenced: string): number {
    const initialParsed = ParserUtils.parseNumeric(condenced);
    if (initialParsed === null) {
      throw new Error('Empty numeric');
    } else if (initialParsed !== undefined) {
      return (initialParsed as number);
    }

    const firstCar = condenced[0];
    const initialSign = ((firstCar === '+') || (firstCar === '-'))
      ? ((firstCar === '+') ? 1 : -1)
      : 0;
    let startPosition = initialSign ? 1 : 0;
    let endPosition = startPosition;
    let newCondenced = condenced
    do {
      const char = newCondenced[endPosition];
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(newCondenced, endPosition);
      }
      if ((endPosition + 1) < newCondenced.length) {
        const nextChar = newCondenced[endPosition + 1];
        if ((nextChar === '+') || (nextChar === '-')) {
          const numeric = newCondenced.substring(startPosition, endPosition + 1);
          const parsed = ParserUtils.parseExpressionMultiply(numeric);
          const parsedSubstitution = (parsed < 0)
            ? `(${parsed})`
            : parsed.toString();
          newCondenced = newCondenced.substring(0, startPosition)
            + parsedSubstitution + newCondenced.substr(endPosition + 1);
          startPosition = startPosition + (parsedSubstitution as string).length + 1;
          endPosition = startPosition;
        } else {
          endPosition++;
        }
      } else {
        const numeric = newCondenced.substring(startPosition, newCondenced.length);
        const parsed = ParserUtils.parseExpressionMultiply(numeric);
        const parsedSubstitution = (parsed < 0)
          ? `(${parsed})`
          : parsed.toString();
        newCondenced = newCondenced.substring(0, startPosition)
          + parsedSubstitution; // + newCondenced.substr(endPosition + 1);
        break;
      }
    } while (startPosition < newCondenced.length); // never
    return ParserUtils.parseExpressionAdding(newCondenced);
  }


  /**
   * Perform multiplicatipn adn division
   * @params condenced string containing *, / and digits (negative in brackets) only
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionMultiply(condenced: string): number {
    const initialParsed = ParserUtils.parseNumeric(condenced);
    if (initialParsed === null) {
      throw new Error('Empty numeric');
    } else if (initialParsed !== undefined) {
      return (initialParsed as number);
    }

    let result = 1;
    let action = 0;
    let startPosition = 0;
    let endPosition = startPosition;
    const length = condenced.length;
    do {
      const char = condenced[endPosition];
      let withBrackets = false;
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(condenced, endPosition);
        withBrackets = true;
      }
      if ((endPosition + 1) < length) {
        const nextChar = condenced[endPosition + 1];
        if ((nextChar === '*') || (nextChar === '/')) {
          const numeric = condenced.substring(
            withBrackets ? (startPosition + 1) : startPosition,
            withBrackets ? endPosition : (endPosition + 1),
          );
          const parsed = ParserUtils.parseNumeric(numeric);
          if ((parsed === null) && (parsed === undefined)) {
            throw new Error(`Invalid numeric: "${numeric}"`);
          }
          if (action) {
            result = (action < 0) ? (result / (parsed as number)) : (result * (parsed as number))
          } else {
            result = parsed as number;
          }
          action = (nextChar === '*') ? 1 : -1;
          startPosition = endPosition + 2;
          endPosition = startPosition;
        } else {
          endPosition++;
        }
      } else {
        const numeric = condenced.substring(
          withBrackets ? (startPosition + 1) : startPosition,
          withBrackets ? endPosition : (endPosition + 1),
        );
        const parsed = ParserUtils.parseNumeric(numeric);
        if ((parsed === null) && (parsed === undefined)) {
          throw new Error(`Invalid numeric: "${numeric}"`);
        }
        if (action) {
          result = (action < 0) ? (result / (parsed as number)) : (result * (parsed as number))
        } else {
          result = parsed as number;
        }
        break;
      }
    } while (startPosition < length); // never
    return result;
  }


  /**
   * Perform adding adn subtraction
   * @params condenced string containing +, - and digits (negative in brackets) only with possiable sign at beginning
   * @returns parsed result
   * @throws on unparsable condensed
   */
  static parseExpressionAdding(condenced: string): number {
    const initialParsed = ParserUtils.parseNumeric(condenced);
    if (initialParsed === null) {
      throw new Error('Empty numeric');
    } else if (initialParsed !== undefined) {
      return (initialParsed as number);
    }

    let result = 0;
    let action = 0;
    const firstCar = condenced[0];
    const initialSign = ((firstCar === '+') || (firstCar === '-'))
      ? ((firstCar === '+') ? 1 : -1)
      : 0;
    let startPosition = initialSign ? 1 : 0;
    let endPosition = startPosition;
    const length = condenced.length;
    do {
      const char = condenced[endPosition];
      let withBrackets = false;
      if (char === '(') {
        endPosition = ParserUtils.findClosingBracket(condenced, endPosition);
        withBrackets = true;
      }
      if ((endPosition + 1) < length) {
        const nextChar = condenced[endPosition + 1];
        if ((nextChar === '+') || (nextChar === '-')) {
          const numeric = condenced.substring(
            withBrackets ? (startPosition + 1) : startPosition,
            withBrackets ? endPosition : (endPosition + 1),
          );
          const parsed = ParserUtils.parseNumeric(numeric);
          if ((parsed === null) && (parsed === undefined)) {
            throw new Error(`Invalid numeric: "${numeric}"`);
          }
          if (action) {
            result = (action < 0) ? (result - (parsed as number)) : (result + (parsed as number))
          } else {
            result = (parsed as number);
            if (initialSign) {
              result *= initialSign;
            }
          }
          action = (nextChar === '+') ? 1 : -1;
          startPosition = endPosition + 2;
          endPosition = startPosition;
        } else {
          endPosition++;
        }
      } else {
        const numeric = condenced.substring(
          withBrackets ? (startPosition + 1) : startPosition,
          withBrackets ? endPosition : (endPosition + 1),
        );
        const parsed = ParserUtils.parseNumeric(numeric);
        if ((parsed === null) && (parsed === undefined)) {
          throw new Error(`Invalid numeric: "${numeric}"`);
        }
        if (action) {
          result = (action < 0) ? (result - (parsed as number)) : (result + (parsed as number))
        } else {
          result = parsed as number;
          if (initialSign) {
            result *= initialSign;
          }
        }
        break;
      }
    } while (startPosition < length); // never
    return result;
  }
}
