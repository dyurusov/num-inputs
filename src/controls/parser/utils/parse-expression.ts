import { ValueType, ParsedType } from '../types';
import parseNumeric from './parse-numeric'

/**
 * @returns
 *  - {number} for correctly parsed value
 *  - {null} for empty parsed value
 *  - {undefined} for incorect value
 */
export default function (value: ValueType): ParsedType {
  return parseNumeric(value);
};
