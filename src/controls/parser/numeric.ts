import { ParserInterface, ValueType, ParsedType } from './types';

export class NumericParser implements ParserInterface {
  parse(value: ValueType): ParsedType {
    if ((value === '') || (value === null) || (value === undefined)) {
      return null;
    }
    const parsedValue: number = parseFloat(value as string);
    return isNaN(parsedValue) ? undefined : parsedValue;

    // TODO:
    // regexp for all cases may be too complicated and may lead to very long parsing
    // const stringValue = (text as string).trim();
    // // should be no spaces
    // // should be not more then one plus or minus and it should be the first
    // // remember sign
    // // should be not more then one decimal point
    // // split by decimal point
    // // if less then one and more then to parts then invalid
    // // if the first part exists then parseFloat and remember
    // // if the second part exists then add decimal dot at the begonning, parseFloat and remember
    // // add the remebered parts
  }
}
