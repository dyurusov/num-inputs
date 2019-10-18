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


  static parseExpressionBrackets(condenced: string): ParsedType {
    /**
     * @TODO
     *  replace after implementation
     * */
    return Infinity; // undefined;

    /*
    1. если начальная позиция содержит * или ., то throw
    2. если конечная позиция содержит *, /, + или -, то throw
    3. находим позицию первой открывающейся скобки
    4. найдена?
      + да
        4.1. находим позицию первой закрывающейся скобки
        4.2. нашили?
          + да
            4.2.1. найденая позиция закрывающейся скобки раньше открывающейся?
              + да
                4.2.1.1. throw
              - нет
                4.2.1.2. нахоим позицию закрывающейся скобки, соответсвующей найденой открывающейся
                4.2.1.3. найдена?
                  + да
                    4.2.1.3.1. пытаемся интерпретировать его как число
                    4.2.1.3.2. получилось?
                      +да
                        4.2.1.3.2.1. находим следующую позицию первой открывающейся скобки по шагу 3 за ранее найденной позицией на этом шаге
                      - нет
                        4.2.1.3.2.2. обрабатываем строку внутри скобок, начиная с шага 1 (при ошибке парсиннга будет throw)
                        4.2.1.3.2.3. получаем строку из полученного результата, если он отрицательный, то оборачиваем его скобками
                        4.2.1.3.2.4. заменяем ранее найденную подстроку со скобками (шаги 4.1 и 4.2.1.2) на новую
                        4.2.1.3.2.5. находим следующую позицию первой открывающейся скобки по шагу 3 за ранее найденной позицией на этом шаге
                  - нет
                    4.2.1.3.3. throw
          - нет
            4.2.2. throw
      -нет
        4.3. обрабатываем группу, не содержащую скобок (кроме скобок для отрицательных чисел) отельной процедурой
    */
  }
}
