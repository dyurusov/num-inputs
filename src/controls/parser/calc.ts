import { ParserInterface } from './types';
import parseExpression from './utils/parse-expression';

export class CalcParser implements ParserInterface {
  constructor(public readonly parse = parseExpression) {}
}
