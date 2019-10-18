import { ParserInterface } from './types';
import Utils from './utils';

export class CalcParser implements ParserInterface {
  constructor(public readonly parse = Utils.parseExpression) {}
}
