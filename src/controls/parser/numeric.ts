import { ParserInterface } from './types';
import Utils from './utils';

export class NumericParser implements ParserInterface {
  constructor(public readonly parse = Utils.parseNumeric) {}
}
