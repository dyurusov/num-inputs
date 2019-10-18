import { ParserInterface } from './types';
import parseNumeric from './utils/parse-numeric';

export class NumericParser implements ParserInterface {
  constructor(public readonly parse = parseNumeric) {}
}
