import { ParserInterface, ValueType, ParsedType } from './types';

export class CalcParser implements ParserInterface {
  parse(value: ValueType): ParsedType {
    if ((value === '') || (value === null) || (value === undefined)) {
      return null;
    }
    const parsedValue: number = parseFloat(value as string);
    return ((parsedValue === null) || (!isNaN(parsedValue) && (parsedValue.toString() === value.toString())))
      ? parsedValue
      : undefined;

    // TODO: expression parsing
  }
}
